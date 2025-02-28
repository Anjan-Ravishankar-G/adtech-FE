import React from 'react';

interface FooterProps {
  imageAlt?: string;
}

const Footer: React.FC<FooterProps> = ({ imageAlt = "Company Logo" }) => {
  return (
    <footer className="w-full py-6 bg-gray-100 border-t">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center">
            <div className="flex items-center space-x-2"> 
            {/* Text placed after the image */}
            <span className="text-gray-700">Powered by</span>
            <div className="h-32 w-auto">
                 {/* Image placed first */}
                  <img 
                  src="/artha-manta-logo-black.png"
                  alt={imageAlt}
                  className="h-full w-auto object-contain"
                  />
            </div>
            </div>
        </div>
    </footer>
  )
};

export default Footer;