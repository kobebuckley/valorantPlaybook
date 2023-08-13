import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { collection, getDoc, getFirestore, doc } from 'firebase/firestore';

interface PostAuthorProps {
  userId: string;
}

export const PostAuthor: React.FC<PostAuthorProps> = ({ userId }) => {
  const [authorDisplayName, setAuthorDisplayName] = useState<string | null>(null);
  const firestore = getFirestore();

  useEffect(() => {
    const fetchAuthorDisplayName = async () => {
      try {
        const userDocRef = doc(firestore, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData) {
            setAuthorDisplayName(userData.displayName); // Use 'displayName' from database
          }
        }
      } catch (error: any) {
        console.error('Error fetching user:', error.message);
      }
    };

    fetchAuthorDisplayName();
  }, [firestore, userId]);

  return <div><span>by {authorDisplayName || 'Unknown author'}</span></div>;
};
