
import React, { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description?: string;
  image?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({ title, description, image }) => {
  useEffect(() => {
    // Update Title
    document.title = title;

    // Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    if (description) {
      metaDescription.setAttribute('content', description);
    }

    // Update Open Graph Image
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
    }
    if (image) {
        ogImage.setAttribute('content', image);
    }

  }, [title, description, image]);

  return null;
};

export default SEOHead;
