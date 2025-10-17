import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

interface ProductBreadcrumbProps {
  slug: string;
  category: string;
  title: string;
}

const ProductBreadcrumb = ({ slug, category, title }: ProductBreadcrumbProps) => {
  return (
    <nav className="mb-6 text-sm text-muted-foreground">
      <ol className="flex items-center gap-2">
        <li><Link to="/" className="hover:text-foreground">Главная</Link></li>
        <li><Icon name="ChevronRight" size={14} /></li>
        <li><Link to="/catalog" className="hover:text-foreground">Каталог</Link></li>
        <li><Icon name="ChevronRight" size={14} /></li>
        <li><Link to={`/catalog/${slug}`} className="hover:text-foreground">{category}</Link></li>
        <li><Icon name="ChevronRight" size={14} /></li>
        <li className="text-foreground">{title}</li>
      </ol>
    </nav>
  );
};

export default ProductBreadcrumb;
