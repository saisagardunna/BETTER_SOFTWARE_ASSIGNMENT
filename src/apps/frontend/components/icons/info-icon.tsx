// src/components/icons/InfoIcon.tsx
import * as React from 'react';

type InfoIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

const InfoIcon: React.FC<InfoIconProps> = (props) => (
  <img
    src="https://cdn-icons-png.flaticon.com/512/471/471664.png"
    alt="info"
    width={20}
    height={20}
    {...props}
  />
);

export default InfoIcon;
