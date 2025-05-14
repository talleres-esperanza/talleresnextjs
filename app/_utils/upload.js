export async function uploadImageToCloudinary(file, uploadPreset) {
  console.log(file);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "b5twbvqk");

  console.log(formData);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/dxog8facm/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    console.log(res.status, await res.text()); // 🔍 Te ayudará a depurar mejor

    throw new Error("Error al subir la imagen a Cloudinary");
  }

  const data = await res.json();
  return data.secure_url;
}
