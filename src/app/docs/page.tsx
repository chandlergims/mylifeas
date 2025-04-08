'use client';

import React from 'react';
import Link from 'next/link';

export default function DocsPage() {
  return (
    <main className="min-h-screen py-12">
      <div className="max-w-4xl px-4 sm:px-6 lg:px-8">

        {/* Table of Contents */}
        <div className="bg-[#e9e3d9] rounded-xl p-6 mb-10 border border-[#d0c3b1]">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Table of Contents</h2>
          <ul className="space-y-2">
            <li>
              <a href="#about" className="text-[#f0b90b] hover:underline">About My Life As</a>
            </li>
            <li>
              <a href="#rewards" className="text-[#f0b90b] hover:underline">Rewards System</a>
            </li>
            <li>
              <a href="#creating-comics" className="text-[#f0b90b] hover:underline">Creating Comics</a>
            </li>
            <li>
              <a href="#generating-images" className="text-[#f0b90b] hover:underline">Generating Images with AI</a>
            </li>
            <li>
              <a href="#templates" className="text-[#f0b90b] hover:underline">Image Generation Templates</a>
            </li>
          </ul>
        </div>

        {/* About Section */}
        <section id="about" className="mb-16">
          <div className="bg-[#e9e3d9] rounded-xl p-8 shadow-md border border-[#d0c3b1]">
            <h2 className="text-3xl font-bold text-[#f0b90b] mb-6" style={{ fontFamily: 'SK Concretica, system-ui, sans-serif' }}>
              About My Life As
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                <strong>My Life As</strong> is a creative platform that allows you to tell your life stories through comic-style illustrations. Whether you want to share a funny anecdote, document a significant life event, or create an entirely fictional narrative, our platform provides the tools to bring your stories to life.
              </p>
              <p className="mt-4">
                Our platform builds on the "My Life As" trend with creative storytelling, allowing you to:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Create custom 4-panel comics with your own images</li>
                <li>Customize layouts, colors, and styles to match your vision</li>
                <li>Share your creations with the community</li>
                <li>Vote on other users' comics</li>
                <li>Earn rewards for creating popular content</li>
              </ul>
              <p className="mt-4">
                All comics are stored securely and can be shared across social media platforms. Your wallet address is associated with your creations, establishing clear ownership of your content.
              </p>
            </div>
          </div>
        </section>

        {/* Rewards Section */}
        <section id="rewards" className="mb-16">
          <div className="bg-[#e9e3d9] rounded-xl p-8 shadow-md border border-[#d0c3b1]">
            <h2 className="text-3xl font-bold text-[#f0b90b] mb-6" style={{ fontFamily: 'SK Concretica, system-ui, sans-serif' }}>
              Rewards System
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                <strong>My Life As</strong> features a monthly rewards program that incentivizes creativity and community engagement. Each month, the creators of the most popular comics receive monetary rewards.
              </p>
              
              <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">How Rewards Work</h3>
              <p>
                Our rewards system is based on community votes. Each user can "like" comics they enjoy, and at the end of each month, the comics with the most likes receive prizes:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li><strong>1st Place:</strong> $3,000 USD</li>
                <li><strong>2nd Place:</strong> $1,500 USD</li>
                <li><strong>3rd Place:</strong> $750 USD</li>
              </ul>
              
              <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">Contest Timeline</h3>
              <p>
                Each contest runs for one calendar month. Winners are announced on the first day of the following month, and rewards are distributed directly to the creators' connected wallets.
              </p>
              
              <div className="bg-[#fff8e1] p-4 rounded-lg mt-6 border-l-4 border-[#f0b90b]">
                <p className="text-sm">
                  <strong>Note:</strong> To be eligible for rewards, you must create your comic while connected to your wallet. This establishes verifiable ownership of your content.
                </p>
              </div>
              
              <p className="mt-6">
                Visit the <Link href="/rewards" className="text-[#f0b90b] hover:underline">Rewards page</Link> to see the current leaderboard and countdown to the next reward distribution.
              </p>
            </div>
          </div>
        </section>

        {/* Creating Comics Section */}
        <section id="creating-comics" className="mb-16">
          <div className="bg-[#e9e3d9] rounded-xl p-8 shadow-md border border-[#d0c3b1]">
            <h2 className="text-3xl font-bold text-[#f0b90b] mb-6" style={{ fontFamily: 'SK Concretica, system-ui, sans-serif' }}>
              Creating Comics
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                Creating a comic on <strong>My Life As</strong> is simple and intuitive. Follow these steps to bring your story to life:
              </p>
              
              <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">Step 1: Connect Your Wallet</h3>
              <p>
                Before creating a comic, connect your wallet using the "Connect Wallet" button in the navigation bar. This establishes ownership of your creation.
              </p>
              
              <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">Step 2: Navigate to Create Page</h3>
              <p>
                Click on the "Create Your Comic" button on the homepage or navigate to the <Link href="/create" className="text-[#f0b90b] hover:underline">Create page</Link>.
              </p>
              
              <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">Step 3: Upload Panel Images</h3>
              <p>
                Upload images for each of the four panels in your comic. These can be:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Photos you've taken</li>
                <li>Images you've created in design software</li>
                <li>AI-generated images (see the "Generating Images with AI" section below)</li>
              </ul>
              <p className="mt-4">
                For best results, use square images with a minimum resolution of 500x500 pixels.
              </p>
              
              <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">Step 4: Customize Your Comic</h3>
              <p>
                Use the settings panel to customize your comic's appearance:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Add a title and customize its appearance</li>
                <li>Adjust panel arrangement and spacing</li>
                <li>Choose panel shapes (rounded or square)</li>
                <li>Add borders and shadows</li>
                <li>Customize background colors or gradients</li>
              </ul>
              
              <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">Step 5: Preview and Publish</h3>
              <p>
                Preview your comic to make sure it looks exactly how you want it. When you're satisfied, click the "Publish Comic" button to share it with the community.
              </p>
              
              <div className="bg-[#fff8e1] p-4 rounded-lg mt-6 border-l-4 border-[#f0b90b]">
                <p className="text-sm">
                  <strong>Pro Tip:</strong> Take your time with the design process. A well-designed comic with a clear narrative is more likely to receive likes from the community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Generating Images Section */}
        <section id="generating-images" className="mb-16">
          <div className="bg-[#e9e3d9] rounded-xl p-8 shadow-md border border-[#d0c3b1]">
            <h2 className="text-3xl font-bold text-[#f0b90b] mb-6" style={{ fontFamily: 'SK Concretica, system-ui, sans-serif' }}>
              Generating Images with AI
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                One of the easiest ways to create compelling panel images for your comic is to use AI image generation tools like ChatGPT's DALL-E. Here's how to create consistent, comic-style images for your panels:
              </p>
              
              <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">Using ChatGPT's Image Generation</h3>
              <ol className="list-decimal pl-6 mt-4 space-y-4">
                <li>
                  <strong>Access ChatGPT:</strong> Go to <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" className="text-[#f0b90b] hover:underline">chat.openai.com</a> and log in to your account.
                </li>
                <li>
                  <strong>Use the Image Generation Feature:</strong> Click on the image generation button or type a command like "Generate an image of..." followed by your description.
                </li>
                <li>
                  <strong>Download the Generated Image:</strong> Once the AI generates an image you like, download it to your device.
                </li>
                <li>
                  <strong>Upload to My Life As:</strong> Upload the downloaded image to one of your comic panels on our Create page.
                </li>
              </ol>
              
              <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">Tips for Consistent Comic Panels</h3>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>
                  <strong>Maintain Character Consistency:</strong> Describe your character with the same features in each prompt to ensure they look the same across panels.
                </li>
                <li>
                  <strong>Specify Art Style:</strong> Always include the art style in your prompt (e.g., "cartoon-style", "comic book style", "2D illustration").
                </li>
                <li>
                  <strong>Request Square Format:</strong> Specify "square format" in your prompts to get images that will fit perfectly in the comic panels.
                </li>
                <li>
                  <strong>Use Templates:</strong> Use our template (see below) as a starting point and modify it for each panel.
                </li>
              </ul>
              
              <div className="bg-[#fff8e1] p-4 rounded-lg mt-6 border-l-4 border-[#f0b90b]">
                <p className="text-sm">
                  <strong>Important:</strong> Make sure you have the right to use any AI-generated images. Different AI services have different terms of service regarding the commercial use of generated content.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Templates Section */}
        <section id="templates" className="mb-16">
          <div className="bg-[#e9e3d9] rounded-xl p-8 shadow-md border border-[#d0c3b1]">
            <h2 className="text-3xl font-bold text-[#f0b90b] mb-6" style={{ fontFamily: 'SK Concretica, system-ui, sans-serif' }}>
              Image Generation Templates
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                To help you create consistent, high-quality comic panels, we've developed a template prompt that you can use with ChatGPT's image generation feature. This template is designed to produce images that work well with our comic format.
              </p>
              
              <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">Basic Template</h3>
              <div className="bg-[#fff8e1] p-4 rounded-lg font-mono text-sm overflow-x-auto">
                A colorful, 2D cartoon-style illustration in a square format with no border, showing a young character with [describe consistent traits, e.g., short brown hair, orange-yellow shirt]. The character is [insert specific action for this panel, e.g., waking up in bed, using a computer, walking outside, etc.]. Soft lighting, smooth background, bold outlines, expressive cartoon style. This is one panel of a multi-panel comic series.
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">How to Customize the Template</h3>
              <p>
                To create a cohesive comic, replace the bracketed sections with your specific details:
              </p>
              <ol className="list-decimal pl-6 mt-4 space-y-4">
                <li>
                  <strong>[describe consistent traits]:</strong> Define your character's appearance that will remain consistent across all panels (e.g., "short brown hair, wearing a blue t-shirt and jeans, round glasses").
                </li>
                <li>
                  <strong>[insert specific action for this panel]:</strong> Describe what the character is doing in this specific panel (e.g., "looking surprised while checking their phone", "laughing with friends at a cafe").
                </li>
              </ol>
              
              <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">Example for a 4-Panel Comic</h3>
              <p>
                Here's how you might adapt the template for each panel of a comic about someone's day:
              </p>
              
              <h4 className="text-lg font-bold text-gray-800 mt-4 mb-2">Panel 1:</h4>
              <div className="bg-[#fff8e1] p-3 rounded-lg font-mono text-sm overflow-x-auto">
                A colorful, 2D cartoon-style illustration in a square format with no border, showing a young woman with long black hair and a green sweater. The character is waking up in bed looking at an alarm clock with a shocked expression. Soft lighting, smooth background, bold outlines, expressive cartoon style. This is one panel of a multi-panel comic series.
              </div>
              
              <h4 className="text-lg font-bold text-gray-800 mt-4 mb-2">Panel 2:</h4>
              <div className="bg-[#fff8e1] p-3 rounded-lg font-mono text-sm overflow-x-auto">
                A colorful, 2D cartoon-style illustration in a square format with no border, showing a young woman with long black hair and a green sweater. The character is rushing to get dressed while brushing her teeth simultaneously. Soft lighting, smooth background, bold outlines, expressive cartoon style. This is one panel of a multi-panel comic series.
              </div>
              
              <h4 className="text-lg font-bold text-gray-800 mt-4 mb-2">Panel 3:</h4>
              <div className="bg-[#fff8e1] p-3 rounded-lg font-mono text-sm overflow-x-auto">
                A colorful, 2D cartoon-style illustration in a square format with no border, showing a young woman with long black hair and a green sweater. The character is running to catch a bus that is starting to pull away. Soft lighting, smooth background, bold outlines, expressive cartoon style. This is one panel of a multi-panel comic series.
              </div>
              
              <h4 className="text-lg font-bold text-gray-800 mt-4 mb-2">Panel 4:</h4>
              <div className="bg-[#fff8e1] p-3 rounded-lg font-mono text-sm overflow-x-auto">
                A colorful, 2D cartoon-style illustration in a square format with no border, showing a young woman with long black hair and a green sweater. The character is arriving at work/school, looking exhausted but relieved. Soft lighting, smooth background, bold outlines, expressive cartoon style. This is one panel of a multi-panel comic series.
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">Advanced Customization</h3>
              <p>
                You can further customize your prompts by specifying:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Different art styles (e.g., "manga style", "watercolor illustration", "pixel art")</li>
                <li>Specific emotions (e.g., "looking excited", "with a confused expression")</li>
                <li>Environmental details (e.g., "in a busy coffee shop", "on a rainy street")</li>
                <li>Time of day (e.g., "at sunset", "in the middle of the night")</li>
                <li>Color schemes (e.g., "with a blue and purple color palette", "in warm autumn colors")</li>
              </ul>
              
              <div className="bg-[#fff8e1] p-4 rounded-lg mt-6 border-l-4 border-[#f0b90b]">
                <p className="text-sm">
                  <strong>Pro Tip:</strong> Save your base character description somewhere so you can easily copy and paste it into each prompt, ensuring consistency across all your panels.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
