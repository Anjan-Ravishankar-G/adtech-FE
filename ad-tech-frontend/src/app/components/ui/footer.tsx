import React from 'react';

interface FooterProps {
  imageAlt?: string;
}

const Footer: React.FC<FooterProps> = ({ imageAlt = "Company Logo" }) => {
  return (
    <footer className="w-full py-6 bg-gray-100 border-t">
      <div className="container mx-auto px-4 flex-col items-center justify-center">
        <div className="flex flex-col items-center space-x-2">
          <span className="text-gray-700">Powered by artha</span>
          {/* Image placeholder - replace src with your actual image path */}
          <div className="h-60">
            {/* This is where you'll add your image */}
            <img 
              src="/artha-manta-logo-black.png"
              alt={imageAlt}
              className="h-full w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;