import React from 'react';

export default function BioContent({ activeTab, darkMode }) {
    const jokesSrc = darkMode
        ? "https://readme-jokes.vercel.app/api?bgColor=%23252525&textColor=%23a4a4a4&aColor=%23a4a4a4&borderColor=%23efefefb3&qColor=%23ff0836"
        : "https://readme-jokes.vercel.app/api?bgColor=%23efefefb3&textColor=%23a4a4a4&borderColor=%23a4a4a4&qColor=%23252525&aColor=%23ff0836";

    return (
        <main className="bio-switcher">
            <section className={`bio short ${activeTab === 'short' ? 'show' : ''}`} aria-labelledby="short">
                Hi there! I'm Abhijith! 👋 I'm a Hardware Developer
                who is passionate about turning ideas into tangible hardware solutions from concept to creation, and I also dabble in Embedded s/m Development and IT Support Engineering.
                Connect with me via <a href="mailto:abhijithabhiakl@gmail.com">email</a> or the other links above and feel free to chat tech or anything under the sun!
            </section>

            <section className={`bio long ${activeTab === 'long' ? 'show' : ''}`} aria-labelledby="long" hidden={activeTab !== 'long'}>
                Hi there! I'm Abhijith! 👋 I'm a passionate Hardware Developer
                dedicated to transforming ideas into tangible hardware solutions, guiding them from concept to creation. I've been immersed in hardware and electronics tinkering since my middle school times. My early curiosity for electronics not only fueled my passion but also elevated my tinkering skills and problem-solving abilities to a pretty good state. Alongside, I explore the realms of Embedded System Development and IT Support Engineering.
                Off the clock, I find joy in crafting mechanical keyboards, tinkering with circuits and devices, cooking up web/mobile apps and touch typing. 🛠️ When it's downtime, catch me jamming to my{' '}
                <a href="https://open.spotify.com/playlist/7CmavsOEjfj9SBk8MWlyXZ?si=b01faa227a264ba9" target="_blank" rel="noopener noreferrer">favorite tunes</a>
                {' '}and getting lost in the immersive universe of PC games. 🎶🎮 <br />
                I hold a degree in Electronics & Communication Engineering from Kalam Technical University. In my free time, I delve into basic graphic designs, create simple websites, and work on custom circuits for both personal projects and for some clients. Thanks for checking out my page! If you have any questions or just want to chat, feel free to reach out to me via <a href="mailto:hi@abhiakl.xyz">email</a> or other links above.😊

                <br /><br />
                Alright, since you've read this far, have a joke:
                <p align="center">
                    <img id="readmejokes" src={jokesSrc} alt="Jokes Card" />
                </p>
                <div id="iframeContainer">
                    <iframe className="iframe" style={{ borderRadius: '12px' }} src="https://open.spotify.com/embed/playlist/2fhbijAhnR0Tjp9XKosNzq?utm_source=generator" width="85%" height="152" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                </div>
            </section>

            <section className={`bio projects ${activeTab === 'projects' ? 'show' : ''}`} aria-labelledby="projects" hidden={activeTab !== 'projects'}>
                <p>Some of my significant projects I've worked on over the years.</p>
                <a id="rgb_text" href="https://codepen.io/avsrriyr-the-vuer/pen/VwoRrgJ" target="_blank" rel="noopener noreferrer">This rgb gradient flow on code pen</a>,<br />
                <a href="https://github.com/abhijithabhiakl/" target="_blank" rel="noopener noreferrer">Auto water pumping system</a>,<br />
                <a href="https://github.com/abhijithabhiakl/" target="_blank" rel="noopener noreferrer">SPWM inverter</a>,<br />
                <a href="https://github.com/abhijithabhiakl/" target="_blank" rel="noopener noreferrer">CNC plotter</a>,<br />
                <a href="https://github.com/abhijithabhiakl/cloudstatus" target="_blank" rel="noopener noreferrer">Weather app (flutter)</a>,<br />
                <a href="https://github.com/abhijithabhiakl/" target="_blank" rel="noopener noreferrer">A variety of Mechanical keyboards</a>,<br />
                <a href="https://github.com/abhijithabhiakl/" target="_blank" rel="noopener noreferrer">Face based attendance management system</a>,<br />
                <a href="https://github.com/abhijithabhiakl/Redragon_K617-QMK_port" target="_blank" rel="noopener noreferrer">Redragon K617 firmware port (to qmk)</a> <br />
                <p>There are more projects than I mentioned here which I lost count after the above & too lazy to document all of it. (EO 2024-12-14)</p>
            </section>

            <section className={`bio blog ${activeTab === 'blog' ? 'show' : ''}`} aria-labelledby="blog" hidden={activeTab !== 'blog'}>
                <h2 id="blog">Recent Blog Posts</h2>
                <ul className="blog-list">
                    <li>
                        <a href="https://blog.abhijithakl.xyz" className="blog-title">I ported my blog to <a href="https://blog.abhijithakl.xyz">this</a> cassidy template</a>
                        <p className="blog-desc">This blog section is a complete mess and hard to blog since i manually need to edit the html code
                            , so i'm moving to a more structured blog, i saw this astro template from cassidy and decided to implement my blog on it</p>
                    </li>
                    <li>
                        <a href="/blogs/homeServer.html" className="blog-title">Raspberry Pi Home Server</a>
                        <p className="blog-desc">I was a lot dependent on servers for various needs & then I thought why can't I host one myself? And I did it with a spare Raspberry Pi lying around with Ubuntu server OS and Cloudflare DDNS & here's how I did it.</p>
                    </li>
                    <li>
                        <a href="/blogs/iotInFarming.html" className="blog-title">IoT in Modern Farming</a>
                        <p className="blog-desc">How IoT is transforming agriculture with real-world applications and benefits.</p>
                    </li>
                    <li>
                        <a href="/blogs/mqttServer.html" className="blog-title">MQTT server with Mosquitto and Grafana</a>
                        <p className="blog-desc">Here's how I setup an MQTT server for my IoT projects.</p>
                    </li>
                    <li>
                        <a href="/blogs/embedded-systems-basics.html" className="blog-title">Basics of Embedded Systems</a>
                        <p className="blog-desc">An introduction to embedded systems, perfect for beginners in hardware development.</p>
                    </li>
                    <li>
                        <a href="/blogs/web-development-on-raspberry-pi.html" className="blog-title">Web Development on Raspberry Pi</a>
                        <p className="blog-desc">Exploring how to host a website on a Raspberry Pi and use it for personal projects.</p>
                    </li>
                </ul>
                <p>Check back for more posts or reach out if you have any questions!</p>
            </section>
        </main>
    );
}
