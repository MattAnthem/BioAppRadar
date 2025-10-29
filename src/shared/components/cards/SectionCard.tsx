import  { type ReactNode } from 'react';
import { useTheme } from '../../hooks/useTheme';

type SectionCardProps = {
    children?: ReactNode;
    className?: string;
}

/**
 * Card to hold the elements inside the dashboard pages.  
 * 
 * @param children: Contents of the card
 * @param className: Additional classes
 * @returns React.JSX.Element
 */
const SectionCard = ({children, className}: SectionCardProps) => {

    const { theme } = useTheme();

    const { bg, border, shadow, primary_text } = theme.sectionCard;

  return (
    <section className={`${className} ${bg} ${border} ${shadow} ${primary_text} rounded-sm mt-4 border`}>
      {children}
    </section>
  )
}

export default SectionCard;