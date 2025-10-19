interface CategoryContentProps {
  categoryData: any;
}

const CategoryContent = ({ categoryData }: CategoryContentProps) => {
  return (
    <div className="prose prose-lg max-w-none mb-12">
      {categoryData.content.h2Sections.map((section: any, idx: number) => (
        <div key={idx} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
          <p className="text-muted-foreground">{section.content}</p>
        </div>
      ))}
    </div>
  );
};

export default CategoryContent;
