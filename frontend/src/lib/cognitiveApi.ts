export const sendCognitiveData = async (payload: any) => {
  try {
    const res = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return await res.json();
  } catch (err) {
    console.error("❌ API Error:", err);
    return null;
  }
};