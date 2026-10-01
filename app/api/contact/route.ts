import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const subject = String(formData.get("subject") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Veuillez renseigner tous les champs obligatoires." },
        { status: 400 },
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { error: "L’adresse e-mail est invalide." },
        { status: 422 },
      );
    }

    const to = process.env.CONTACT_EMAIL ?? "commercial@promed.tn";
    const payload = {
      name,
      email,
      subject,
      message,
      recipient: to,
      submittedAt: new Date().toISOString(),
    };

    console.info("AVA contact submission received", payload);

    return NextResponse.json({
      success: true,
      message: "Merci, votre demande a été envoyée.",
    });
  } catch (error) {
    console.error("Contact form error", error);
    return NextResponse.json(
      { error: "Erreur lors de l’envoi. Réessayez ou appelez-nous." },
      { status: 500 },
    );
  }
}
