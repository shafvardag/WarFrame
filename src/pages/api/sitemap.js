// import axios from 'axios';
// import { create } from 'xmlbuilder2';


// const fetchBlogUrls = async () => {
//   try {
//     const response = await axios.post("slug_fetch_url");
//     if (response.data.status === 'success' && Array.isArray(response.data.data)) {
//       return response.data.data.map(blog => ({
//         url: `${blog.slug}`,
//         lastmod: new Date().toISOString().split('T')[0] 
//       }));
//     } else {
//       console.error("Unexpected response format:", response.data);
//       return [];
//     }
//   } catch (error) {
//     console.error("Error fetching blog URLs:", error);
//     return [];
//   }
// };

// const staticRoutes = [
//     { url: '/', lastmod: '2023-01-01' }
//   ];
  

//   export default async function handler(req, res) {
//     const dynamicRoutes = await fetchBlogUrls();

//     const allRoutes = [...staticRoutes, ...dynamicRoutes];
  
//     const root = create({ version: '1.0' })
//       .ele('urlset', { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' });
  
//     allRoutes.forEach(route => {
//       root.ele('url')
//         .ele('loc').txt(`https://website-name.com${route.url}`).up()
//         .ele('lastmod').txt(route.lastmod).up()
//         .up();
//     });
  
//     const xml = root.end({ prettyPrint: true });
  
//     res.setHeader('Content-Type', 'application/xml');
//     res.status(200).send(xml);
//   }
