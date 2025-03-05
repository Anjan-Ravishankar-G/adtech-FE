// import { cn } from "@/lib/utils";

// export function LoginForm({
//   className,
//   ...props
// }: React.ComponentPropsWithoutRef<"form">) {
//   return (
//     <div className="bg-white rounded-2xl dark:bg-black" style={{ width: '500px', height: '500px' }}>
//     <form className="p-5 ">
//       <div className="flex flex-col items-center gap-2 text-center ">
//         <h1 className="text-2xl font-bold">Login to your account</h1>
//         <p className="text-balance text-sm text-muted-foreground">
//           Enter your email below to login to your account
//         </p>
//       </div>
//       <div className="grid gap-6">
//         <div className="grid gap-2">
//           <label htmlFor="email" className="text-black dark:text-white">
//             Email
//           </label>
//           <input
//             id="email"
//             type="email"
//             placeholder="m@example.com"
//             required
//             className="text-white w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:bg-[#1e1e1e]"
//           />
//         </div>
//         <div className="grid gap-2">
//           <div className="flex items-center">
//             <label htmlFor="password" className="text-sm font-medium">
//               Password
//             </label>
//           </div>
//           <input
//             id="password"
//             type="password"
//             required
//             placeholder="required"
//             className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:bg-[#1e1e1e]"
//           />
//            <a
//               href="#"
//               className="ml-auto text-sm underline-offset-4 hover:underline"
//             >
//               Forgot your password?
//             </a>
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-900 dark:hover:bg-blue-600"
//         >
//           Login
//         </button>
//         <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
//           <span className="relative z-10 bg-background px-2 text-muted-foreground">
//             Or continue with
//           </span>
//         </div>
//         <button
//           type="button"
//           className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-black py-2 rounded-2xl hover:bg-gray-500 transition duration-300 dark:text-white dark:bg-[#1e1e1e] dark:hover:bg-gray-600"
//         >
//           login with email
//         </button>
//       </div>
//       <div className="text-center text-sm mt-1 gap-2">
//         Don&apos;t have an account?{" "}
//         <a href="#" className="underline underline-offset-4">
//           Sign up
//         </a>
//       </div>
//     </form>
//     </div>
//   );
// }