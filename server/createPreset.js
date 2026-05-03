const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dajkgy9is",
  api_key: "453144783952232",
  api_secret: "_1SHjiPFTG_rl42qg9Yzbh_JdKo",
});

async function createPreset() {
  try {
    const res = await cloudinary.api.create_upload_preset({
      name: "mern_upload",
      unsigned: true,
      folder: "products",
    });

    console.log("✅ SUCCESS:", res.name);
  } catch (err) {
    console.error("❌ FULL ERROR:");
    console.log(err);
  }
}

createPreset();