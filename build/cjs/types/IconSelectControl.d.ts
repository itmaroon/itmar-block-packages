interface IconStyle {
    icon_type: "awesome" | "image" | "avatar" | string;
    icon_url?: string;
    icon_name?: string;
    icon_pos?: "left" | "right" | string;
    icon_size?: string;
    icon_color?: string;
    icon_space?: string;
    icon_family?: string;
}
interface IconControlProps {
    iconStyle: IconStyle;
    setPosition?: boolean;
    onChange: (newStyle: IconStyle) => void;
}
declare const _default: ({ iconStyle, setPosition, onChange }: IconControlProps) => import("react/jsx-runtime").JSX.Element;
export default _default;
