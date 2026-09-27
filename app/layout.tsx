import type {Metadata} from "next";
import "./globals.css";

export const metadata:Metadata={
 title:{default:"PDF Tools — Free Online PDF & Image Tools",template:"%s | PDF Tools"},
 description:"Free browser-based PDF and image tools. Merge, split, rotate PDFs and convert images to PDF without uploading your files.",
 keywords:["PDF tools","merge PDF","split PDF","rotate PDF","image to PDF","compress image","free PDF tools"],
 metadataBase:new URL("https://yiminggod1.github.io/pdf-tools/"),
 alternates:{canonical:"https://yiminggod1.github.io/pdf-tools/"},
 openGraph:{title:"PDF Tools — Free Online PDF & Image Tools",description:"Fast, private PDF and image tools that run in your browser.",type:"website",url:"https://yiminggod1.github.io/pdf-tools/"},
 robots:{index:true,follow:true}
};

export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="en"><body>{children}<footer><div><strong>PDF Tools</strong><span>Free browser-based document utilities</span></div><nav><a href="/">Home</a><a href="/merge-pdf/">Merge PDF</a><a href="/split-pdf/">Split PDF</a><a href="/image-to-pdf/">Image to PDF</a></nav><small>Your files stay in your browser. No account required.</small></footer></body></html>
}