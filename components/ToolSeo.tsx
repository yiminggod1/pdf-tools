import Link from "next/link";

type Props={title:string;intro:string;useCases:string[];faq:[string,string][];links:[string,string][]};

export default function ToolSeo({title,intro,useCases,faq,links}:Props){
  return <section className="content toolSeo">
    <h2>{title}</h2><p>{intro}</p>
    <h2>Common uses</h2><ul>{useCases.map(x=><li key={x}>{x}</li>)}</ul>
    <h2>Related tools</h2><div className="seoLinks">{links.map(([label,url])=><Link key={url} href={url}>{label} →</Link>)}</div>
    <h2>Frequently asked questions</h2>{faq.map(([q,a])=><details className="faq" key={q}><summary>{q}</summary><p>{a}</p></details>)}
  </section>
}