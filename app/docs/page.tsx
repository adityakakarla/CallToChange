import { Inter } from "next/font/google";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export default function Docs() {
    return (
        <div className={`${inter.variable} antialiased bg-[#204544] min-h-screen flex flex-col py-32 px-20`}
            style={{ fontFamily: 'var(--font-inter)' }}>
            <div className="bg-white rounded-lg p-10">
                <h1 className="text-[#204544] text-6xl mb-8">Docs</h1>
                <section className="mb-10">
                    <h2 className="text-4xl mb-4">Getting Started</h2>
                    <p className="text-lg mb-4">
                        To get started with our library, install it using pip:
                    </p>
                    <pre className="bg-gray-100 p-4 rounded-lg">
                        <code className="text-sm">
                            pip install call-to-change
                        </code>
                    </pre>
                </section>

                <section className="mb-10">
                    <h2 className="text-4xl mb-4">Usage Example</h2>
                    <p className="text-lg mb-4">
                        Here’s a simple example of how to use CallToChange in your project:
                    </p>
                    <pre className="bg-gray-100 p-4 rounded-lg">
                        <code className="text-sm">
                            {`from openai import OpenAI
from call_to_change import log

client = OpenAI()

log(client, 'test@test.com')

response = client.chat.completions.create(
  model="gpt-4o-mini",
  messages=[
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Who won the world series in 2020?"},
  ]
)

print(response.choices[0].message.content)`}
                        </code>
                    </pre>
                </section>

                <section>
                    <h2 className="text-4xl mb-4">Behind The Scenes</h2>
                    <p className="text-lg mb-4">
                        Our library consists of multiple systems:
                    </p>
                    <ul className="list-disc list-inside mb-4">
                        <li>
                            <p>Next.js for our full-stack application</p>
                        </li>
                        <li>
                            <p>Clerk for user authentication</p>
                        </li>
                        <li>
                            <p>SUI for carbon offset transactions</p>
                        </li>
                        <li>
                            <p>SingleStore for blazingly fast data updates</p>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
