import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

interface FAQCategory {
  title: string;
  items: { question: string; answer: string }[];
}

const categories: FAQCategory[] = [
  {
    title: "General",
    items: [
      {
        question: "What is CrackYourSchool?",
        answer:
          "CrackYourSchool is a free AI study platform. Upload your lecture notes or PDFs and instantly generate quizzes, flashcards, summaries, and mind maps, or chat with an AI tutor about the material.",
      },
      {
        question: "Do I need to install anything?",
        answer: "No, CrackYourSchool runs entirely in your browser. Just sign up and start uploading documents.",
      },
      {
        question: "What file types can I upload?",
        answer: "PDF documents are fully supported today, including scanned pages with images for AI-assisted analysis.",
      },
    ],
  },
  {
    title: "Pricing & Plans",
    items: [
      {
        question: "Is CrackYourSchool really free?",
        answer:
          "Yes. The Free plan includes 2 PDF uploads and 30 AI tutor questions per month, plus unlimited quiz and flashcard generation, with no credit card required.",
      },
      {
        question: "What do I get with Pro?",
        answer:
          "Pro removes the PDF and question limits entirely, and adds priority support, advanced analytics, and export capabilities, for $12/month or $99/year.",
      },
      {
        question: "Can I cancel anytime?",
        answer:
          "Yes. You can cancel your subscription at any time from your account, and you'll keep Pro access until the end of your current billing period.",
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit and debit cards, processed securely through Stripe.",
      },
    ],
  },
  {
    title: "Features",
    items: [
      {
        question: "How does the quiz generator work?",
        answer:
          "Upload a PDF and our AI reads the content to generate a mix of multiple-choice and short-answer questions covering the key topics, at a mix of difficulty levels.",
      },
      {
        question: "Can I customize my flashcards?",
        answer:
          "Yes. You can choose the card count, style (term-definition, question-answer, concept explanation, or cloze), difficulty, and topic focus before generating.",
      },
      {
        question: "What can the AI tutor help with?",
        answer:
          "Ask it to explain concepts, work through problems step by step, or quiz you on a topic. It's designed to be patient and break things down clearly.",
      },
    ],
  },
  {
    title: "Account & Privacy",
    items: [
      {
        question: "Is my data private?",
        answer:
          "Yes. Your uploaded documents, quizzes, flashcards, and conversations are private to your account and protected by row-level security in our database.",
      },
      {
        question: "How do I delete my account or data?",
        answer: "Contact us and we'll delete your account and associated data on request.",
      },
    ],
  },
];

const FAQPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20 md:pt-24 pb-12 md:pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12 md:mb-16 space-y-3 md:space-y-4">
            <Badge className="bg-accent text-accent-foreground px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium rounded-full">
              <HelpCircle className="w-3 h-3 mr-1" />
              Frequently Asked Questions
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold px-4">Got Questions?</h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Everything you need to know about CrackYourSchool.
            </p>
          </div>

          <div className="space-y-10 md:space-y-12">
            {categories.map((category) => (
              <div key={category.title}>
                <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">{category.title}</h2>
                <Accordion type="single" collapsible>
                  {category.items.map((item, index) => (
                    <AccordionItem key={index} value={`${category.title}-${index}`}>
                      <AccordionTrigger className="text-left text-sm md:text-base">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-sm md:text-base">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQPage;
