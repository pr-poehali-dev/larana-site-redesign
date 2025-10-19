import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

interface CategoryBreadcrumbProps {
  breadcrumb: Array<{ name: string; url: string }>;
}

const CategoryBreadcrumb = ({ breadcrumb }: CategoryBreadcrumbProps) => {
  return (
    <nav className="mb-6 text-sm text-muted-foreground" aria-label="Хлебные крошки">
      <ol className="flex items-center gap-2" itemScope itemType="https://schema.org/BreadcrumbList">
        {breadcrumb.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            {idx > 0 && <Icon name="ChevronRight" size={14} />}
            {idx === breadcrumb.length - 1 ? (
              <span className="text-foreground" itemProp="name">{item.name}</span>
            ) : (
              <Link to={item.url} className="hover:text-foreground transition-colors" itemProp="item">
                <span itemProp="name">{item.name}</span>
              </Link>
            )}
            <meta itemProp="position" content={String(idx + 1)} />
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default CategoryBreadcrumb;
