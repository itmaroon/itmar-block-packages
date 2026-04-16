interface FontStyle {
    default_fontSize: string;
    mobile_fontSize: string;
    fontSize?: string;
    fontFamily: string;
    fontWeight: string;
    isItalic: boolean;
}
interface TypographyControlsProps {
    title: string;
    fontStyle: FontStyle;
    initialOpen?: boolean;
    isMobile: boolean;
    onChange: (newStyle: FontStyle) => void;
}
declare const TypographyControls: ({ title, fontStyle, initialOpen, isMobile, onChange, }: TypographyControlsProps) => import("react/jsx-runtime").JSX.Element;
export default TypographyControls;
