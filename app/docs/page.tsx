export default function Docs() {
    return (
        <div className="min-h-screen flex flex-col py-32 px-20">
            <div className="bg-white rounded-lg p-10">
                <h1 className="text-[#204544] text-6xl mb-8">Docs</h1>
                <section className="mb-10">
                    <h2 className="text-4xl mb-4">Getting Started</h2>
                    <p className="text-lg mb-4">
                        To get started with our library, install it using npm or yarn:
                    </p>
                    <pre className="bg-gray-100 p-4 rounded-lg">
                        <code className="text-sm">
                            npm install my-library
                            <br />
                            or
                            <br />
                            yarn add my-library
                        </code>
                    </pre>
                </section>

                <section className="mb-10">
                    <h2 className="text-4xl mb-4">Usage Example</h2>
                    <p className="text-lg mb-4">
                        Here’s a simple example of how to use the library in your project:
                    </p>
                    <pre className="bg-gray-100 p-4 rounded-lg">
                        <code className="text-sm">
                            {`import MyComponent from 'my-library';

function App() {
    return (
        <div>
            <MyComponent />
        </div>
    );
}

export default App;`}
                        </code>
                    </pre>
                </section>

                <section>
                    <h2 className="text-4xl mb-4">API Reference</h2>
                    <p className="text-lg mb-4">
                        Our library provides several components and utilities:
                    </p>
                    <ul className="list-disc list-inside mb-4">
                        <li>
                            <strong>MyComponent:</strong> This component does XYZ.
                        </li>
                        <li>
                            <strong>AnotherComponent:</strong> This component handles ABC.
                        </li>
                    </ul>
                    <pre className="bg-gray-100 p-4 rounded-lg">
                        <code className="text-sm">
                            {`// MyComponent Props
interface MyComponentProps {
    prop1: string;
    prop2: number;
}

const MyComponent: React.FC<MyComponentProps> = ({ prop1, prop2 }) => {
    return <div>{prop1} - {prop2}</div>;
};`}
                        </code>
                    </pre>
                </section>
            </div>
        </div>
    );
}
