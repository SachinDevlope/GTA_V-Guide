'use client';

import { useState } from 'react';
import type { ImageRef } from '@/shared/types';
import type { CategoryKey } from '../types';
import { CategoryIcon } from './CategoryIcon';
import styles from './ItemMedia.module.css';

interface Props {
  cat: CategoryKey;
  image: ImageRef | null;
  alt: string;
  /** "card" = wide picture on a card, "thumb" = small square, "hero" = detail page. */
  variant: 'card' | 'thumb' | 'hero';
}

/** Item picture with a tidy icon placeholder when there is no image (or it fails to load). */
export function ItemMedia({ cat, image, alt, variant }: Props) {
  const [failed, setFailed] = useState(false);
  return (
    // Weapon pictures are studio shots on a beige backdrop: show them whole on a matching background.
    <div className={`${styles.media} ${styles[variant]} ${cat === 'weapons' && image && !failed ? styles.paper : ''}`}>
      {image && !failed ? (
        // Remote wiki images: plain <img> keeps them lazy and avoids proxying through the server.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={cat === 'characters' ? styles.face : undefined}
          src={image.src}
          alt={alt}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      ) : (
        <CategoryIcon cat={cat} className={styles.placeholder} />
      )}
    </div>
  );
}
