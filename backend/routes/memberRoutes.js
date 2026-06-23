const express = require("express");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
//const pdfPoppler = require("pdf-poppler");
const Counter = require("../models/Counter");
const Member = require("../models/Member");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

function cleanOcrValue(value) {
  if (!value) return "";

  return value
    .replace(/[|॥'":;]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function hasTamil(value) {
  return /[\u0B80-\u0BFF]/.test(value || "");
}

function isBadNameLine(line) {
  return /aadhaar|ஆதார்|government|india|identity|citizenship|proof|சான்று|குடியுரிமை|unique|identification|authority|enrolment|vid|mobile|district|state|pin|address/i.test(
    line
  );
}

function extractNameFromLines(lines) {
  const toIndex = lines.findIndex((line) => /^to$/i.test(cleanOcrValue(line)));

  if (toIndex !== -1) {
    for (let i = toIndex + 1; i < Math.min(toIndex + 6, lines.length); i++) {
      const line = cleanOcrValue(lines[i]);

      if (
        line &&
        !isBadNameLine(line) &&
        !/D\/o|S\/o|C\/o|W\/o/i.test(line) &&
        !/[0-9]/.test(line)
      ) {
        return line;
      }
    }
  }

  const dobIndex = lines.findIndex((line) =>
    /DOB|Date of Birth|பிறந்த/i.test(line)
  );

  if (dobIndex !== -1) {
    for (let i = dobIndex - 1; i >= Math.max(0, dobIndex - 6); i--) {
      const line = cleanOcrValue(lines[i]);

      if (
        line &&
        !isBadNameLine(line) &&
        !/[0-9]/.test(line) &&
        !/D\/o|S\/o|C\/o|W\/o/i.test(line)
      ) {
        return line;
      }
    }
  }

  return "";
}

function extractFatherName(lines) {
  const fatherLine = lines.find((line) => /S\/O|D\/O|C\/O|W\/O|S\.O|D\.O|C\.O|W\.O/i.test(line));

  if (!fatherLine) return "";

  return cleanOcrValue(
    fatherLine.replace(/S\/O|D\/O|C\/O|W\/O|S\.O|D\.O|C\.O|W\.O/gi, "")
  );
}

function extractAddress(lines) {
  const startIndex = lines.findIndex((line) =>
    /S\/O|D\/O|C\/O|W\/O|S\.O|D\.O|C\.O|W\.O/i.test(line)
  );

  if (startIndex === -1) return "";

  const addressLines = [];

  for (let i = startIndex + 1; i < lines.length; i++) {
    let line = cleanOcrValue(lines[i]);

    if (!line) continue;

    if (/mobile/i.test(line)) break;
    if (/your aadhaar|aadhaar no|உங்கள் ஆதார்/i.test(line)) break;
    if (/signature|VID/i.test(line)) break;

    line = line
      .replace(/VTC/gi, "")
      .replace(/PO/gi, "")
      .replace(/District/gi, "")
      .replace(/State/gi, "")
      .replace(/PIN Code/gi, "")
      .replace(/PinCode/gi, "")
      .replace(/:/g, "")
      .trim();

    if (line) addressLines.push(line);
  }

  return addressLines.join(", ");
}



function extractAadhaarData(text) {
  const cleanText = text.replace(/\s+/g, " ").trim();

  const aadhaarMatch = cleanText.match(/\b\d{4}\s?\d{4}\s?\d{4}\b/);

  const dobMatch =
    cleanText.match(/\b\d{2}\/\d{2}\/\d{4}\b/) ||
    cleanText.match(/\b\d{2}-\d{2}-\d{4}\b/);

  const mobileMatch = cleanText.match(/\b[6-9]\d{9}\b/);

  const lines = text
    .split("\n")
    .map((line) => cleanOcrValue(line))
    .filter(Boolean);

  const dateOfBirth = dobMatch ? dobMatch[0] : "";

  let gender = "";
  if (/FEMALE|பெண்/i.test(text)) gender = "பெண்";
  else if (/MALE|ஆண்/i.test(text)) gender = "ஆண்";

  return {
    name: extractNameFromLines(lines),
    fatherName: extractFatherName(lines),
    dob: dateOfBirth,
    age: calculateAgeFromDOB(dateOfBirth),
    gender,
    address: extractAddress(lines),
    mobile: mobileMatch ? mobileMatch[0] : "",
    aadhaarNumber: aadhaarMatch ? aadhaarMatch[0] : "",
    rawText: text,
  };
}

function isEnglish(text) {
  if (!text) return false;
  const letters = text.replace(/[^A-Za-z]/g, "");
  return letters.length > 0;
}

function calculateAgeFromDOB(dob) {
  if (!dob) return "";

  let day;
  let month;
  let year;

  if (dob.includes("/")) {
    [day, month, year] = dob.split("/");
  } else if (dob.includes("-")) {
    [day, month, year] = dob.split("-");
  } else {
    return "";
  }

  const birthDate = new Date(`${year}-${month}-${day}`);
  const today = new Date();

  if (isNaN(birthDate.getTime())) return "";

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

function cleanSpecialChars(value) {
  if (!value) return "";

  return String(value)
    .replace(/[॥|"'`~^*_={}\[\]<>]/g, "")
    .replace(/[;:]/g, "")
    .replace(/\.+/g, "")
    .replace(/,+/g, ",")
    .replace(/\s+,/g, ",")
    .replace(/,\s*/g, ", ")
    .replace(/\s+/g, " ")
    .replace(/,\s*$/g, "")
    .trim();
}

function fixTamilNameSpacing(name) {
  if (!name) return "";

  let cleaned = cleanSpecialChars(name);

  // Example: கீர்த்திகாப → கீர்த்திகா ப
  cleaned = cleaned.replace(/([ாிீுூெேைொோௌ்])([அ-ஹ])$/u, "$1 $2");

  return cleaned.trim();
}

function cleanExtractedData(data) {
  return {
    ...data,
    name: fixTamilNameSpacing(data.name),
    fatherName: cleanSpecialChars(data.fatherName),
    address: cleanSpecialChars(data.address),
  };
}

async function generateMemberIdFromDB() {
  const currentYear = new Date().getFullYear();
  const prefix = `SRC-${currentYear}-`;

  const lastMember = await Member.findOne({
    memberId: { $regex: `^${prefix}` },
  }).sort({ memberId: -1 });

  let nextNumber = 1;

  if (lastMember && lastMember.memberId) {
    const lastNumber = parseInt(lastMember.memberId.split("-")[2], 10);
    nextNumber = lastNumber + 1;
  }

  return `${prefix}${String(nextNumber).padStart(4, "0")}`;
}

async function translateToTamil(data) {
  const skipKeys = new Set([
    "aadhaarNumber",
    "dob",
    "age",
    "mobile",
    "email",
    "referrerNumber",
    "rawText",
    "gender",
  ]);

  const result = { ...data };

  for (const [key, value] of Object.entries(data)) {
    if (!value || skipKeys.has(key)) continue;

    const textValue = String(value);

    if (hasTamil(textValue)) {
      result[key] = textValue;
      continue;
    }

    if (isEnglish(textValue)) {
      try {
        result[key] = await translateTextToTamil(textValue);
      } catch (error) {
        console.error(`Translation failed for ${key}:`, error);
      }
    }
  }

  return result;
}

async function translateTextToTamil(text) {
  if (!text) return text;
  const encoded = encodeURIComponent(text);
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ta&dt=t&q=${encoded}`;

  const response = await fetch(url, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "Mozilla/5.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Translation API failed with status ${response.status}`);
  }

  const body = await response.json();
  if (!Array.isArray(body) || !Array.isArray(body[0])) {
    throw new Error("Unexpected translation response format");
  }

  return body[0].map((chunk) => chunk[0]).join("");
}


async function normalizeToJpeg(filePath, mimetype, filename) {
  const fileBuffer = await fs.promises.readFile(filePath);
  const lowerName = (filename || filePath || "").toLowerCase();
  const isPdf = mimetype === "application/pdf" || lowerName.endsWith(".pdf");

  if (isPdf) {
    try {
      return await sharp(fileBuffer, { density: 200 })
        .rotate()
        .jpeg({ quality: 90 })
        .toBuffer();
    } catch (sharpError) {
      const tempDir = path.dirname(filePath);
      const baseName = `${path.basename(filePath, path.extname(filePath))}-pdf`;
      const options = {
        format: "jpeg",
        out_dir: tempDir,
        out_prefix: baseName,
        page: 1,
        dpi: 200,
      };

      //await pdfPoppler.convert(filePath, options);
      const convertedPath = path.join(tempDir, `${baseName}-1.jpg`);
      const jpegBuffer = await fs.promises.readFile(convertedPath);
      await fs.promises.unlink(convertedPath).catch(() => {});
      return jpegBuffer;
    }
  }

  return sharp(fileBuffer)
    .rotate()
    .resize({ width: 2000, height: 2000, fit: "inside" })
    .jpeg({ quality: 90 })
    .toBuffer();
}

router.post("extract-aadhaar", upload.single("aadhaar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload Aadhaar file",
      });
    }

    const filePath = path.resolve(req.file.path);
    const normalizedBuffer = await normalizeToJpeg(
      filePath,
      req.file.mimetype,
      req.file.originalname
    );

    const tempJpegPath = `${filePath}.normalized.jpg`;
    await fs.promises.writeFile(tempJpegPath, normalizedBuffer);

    const result = await Tesseract.recognize(tempJpegPath, "eng+tam", {
      logger: (m) => console.log(m.status, m.progress),
    });

    const extractedData = extractAadhaarData(result.data.text);
    const translatedData = await translateToTamil(extractedData);
    const cleanedData = cleanExtractedData(translatedData);

    const memberId = await generateMemberIdFromDB();
    cleanedData.memberId = memberId;

    const member = new Member({
      ...cleanedData,
      memberId,
      status: "DRAFT",
      aadhaarFile: req.file ? req.file.path : "",
    });

    await member.save();

    await fs.promises.unlink(tempJpegPath).catch(() => {});

    res.json({
      success: true,
      data: cleanedData,
      memberId,
    });
  } catch (error) {
    console.error("Aadhaar OCR Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to extract Aadhaar data. Please upload a clear JPG, PNG, HEIC or PDF image.",
    });
  }
});

router.post("submit-data", upload.single("photo"), async (req, res) => {
  try {
    if (!req.body.memberId) {
      return res.status(400).json({
        success: false,
        message: "Member ID is required",
      });
    }

    const updatedMember = await Member.findOneAndUpdate(
      { memberId: req.body.memberId },
      {
        $set: {
          name: req.body.name,
          fatherName: req.body.fatherName,
          age: req.body.age,
          dob: req.body.dob,
          address: req.body.address,
          aadhaarNumber: req.body.aadhaarNumber,
          mobile: req.body.mobile,
          email: req.body.email,
          occupation: req.body.occupation,
          referrerName: req.body.referrerName,
          referrerNumber: req.body.referrerNumber,
          photo: req.file ? req.file.path : "",
          status: "COMPLETED",
        },
      },
      { new: true }
    );

    if (!updatedMember) {
      return res.status(404).json({
        success: false,
        message: "Member not found for this Member ID",
      });
    }

    res.json({
      success: true,
      message: "Member updated successfully",
      data: updatedMember,
    });
  } catch (error) {
    console.error("Update member error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update member",
    });
  }
});

router.get("view-members", async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch members",
    });
  }
});

router.delete("delete-member/:memberId", async (req, res) => {
  try {
    const deletedMember = await Member.findOneAndDelete({
      memberId: req.params.memberId,
    });

    if (!deletedMember) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.json({
      success: true,
      message: "Member deleted successfully",
    });
  } catch (error) {
    console.error("Delete member error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete member",
    });
  }
});

module.exports = router;