import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuizClient from "./QuizClient";

export const metadata = {
  title: "Quiz — Miroir d'Instinct | Maison trya.",
  description:
    "Découvre la collection Maison trya. qui te ressemble : Vulnérabilité, Éveil ou Férocité.",
};

export default function QuizPage() {
  return (
    <>
      <Header forceDark />
      <QuizClient />
      <Footer />
    </>
  );
}
