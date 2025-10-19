import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface CategoryFAQProps {
  faq: Array<{ question: string; answer: string }>;
}

const CategoryFAQ = ({ faq }: CategoryFAQProps) => {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-6">Часто задаваемые вопросы</h2>
      <Accordion type="single" collapsible className="w-full">
        {faq.map((item, idx) => (
          <AccordionItem key={idx} value={`faq-${idx}`}>
            <AccordionTrigger className="text-left text-lg font-semibold">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default CategoryFAQ;
