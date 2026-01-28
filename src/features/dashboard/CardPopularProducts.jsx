// import { useGetDashboardMetricsQuery } from '@/state/api';
// import { ShoppingBag } from 'lucide-react';

// const indexImg = Math.floor(Math.random() * 3) + 1;

// const CardPopularProducts = () => {
//   const { data: dashboardMetrics, isLoading } = useGetDashboardMetricsQuery();

//   return (
//     <div className="row-span-3 rounded-2xl bg-white pb-16 shadow-md xl:row-span-6">
//       {isLoading ? (
//         <div className="m-5">Loading...</div>
//       ) : (
//         <>
//           <h3 className="px-7 pt-5 pb-2 text-lg font-semibold">
//             Popular Products
//           </h3>
//           <hr />
//           <div className="h-full overflow-auto">
//             {dashboardMetrics?.popularProducts.map((product) => (
//               <div
//                 key={product.productId}
//                 className="flex items-center justify-between gap-3 border-b px-5 py-7"
//               >
//                 <div className="flex items-center gap-3">
//                   <img
//                     src={`https://s3-inventorymanagement.s3.us-east-2.amazonaws.com/product${indexImg}.png`}
//                     alt={product.name}
//                     width={48}
//                     height={48}
//                     className="h-14 w-14 rounded-lg"
//                   />
//                   <div className="flex flex-col justify-between gap-1">
//                     <div className="font-bold text-gray-700">
//                       {product.name}
//                     </div>
//                     <div className="flex items-center text-sm">
//                       <span className="text-xs font-bold text-blue-500">
//                         ${product.price}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex items-center text-xs">
//                   <button className="mr-2 rounded-full bg-blue-100 p-2 text-blue-600">
//                     <ShoppingBag className="h-4 w-4" />
//                   </button>
//                   {Math.round(product.stockQuantity / 1000)}k Sold
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default CardPopularProducts;
