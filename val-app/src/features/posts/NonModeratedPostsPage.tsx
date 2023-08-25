// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Post } from './postsSlice'; 
// import { useSelector } from 'react-redux';
// import { selectLoggedInUser } from '../users/usersSlice';

// const NonModeratedPostsPage: React.FC = () => {
//   const [nonModeratedPosts, setNonModeratedPosts] = useState<Post[]>([]);
//   const loggedInUser = useSelector(selectLoggedInUser);
// // updating
//   useEffect(() => {
//     if (loggedInUser && loggedInUser.isAdmin) {
      
//       const fetchNonModeratedPosts = async () => {
//         try {
//           console.log("hmm  " )
//           const response = await axios.get('http://localhost:3000/api/posts/non-moderated', { withCredentials: true });
//           console.log("hmm the response is: " + response)
//           setNonModeratedPosts(response.data);
//         } catch (error) {
//           console.error('Error fetching non-moderated posts:', error);
//         }
//       };

//       fetchNonModeratedPosts();
//     }
//   }, [loggedInUser]);

//   return (
//     <div>
//       {loggedInUser && loggedInUser.isAdmin ? (
//         <div>
//           <h2>Non-Moderated Posts</h2>
//           <ul>
//             {nonModeratedPosts.map((post) => (
//               <li key={post.id}>
//                 <h3>{post.title}</h3>
//                 <p>{post.content}</p>
//               </li>
//             ))}
//           </ul>
//         </div>
//       ) : (
//         <div>You don't have permission to view this page.</div>
//       )}
//     </div>
//   );
// };

// export default NonModeratedPostsPage;
