import "../css/home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="hero">
        {/* hero - video */}
        <video className="hero-video" autoPlay loop muted playsInline>
            <source src="/videos/highlandCow.mp4" type="video/mp4" />
        </video>
        <div className="hero-text">
            <h1>Paisley Highland Games</h1>
        </div>
      </section>

      {/* About section */}
      <section className="about py-5">
        <div className="container">
            {/* header */}
            <h2 className="mb-3 mt-3 text-center text-md-start about-title">About Us</h2>
            {/* container */}
            <div className="row align-items-center shadow about-container">
                {/* left side */}
                <div className="col-md-6 mb-4 mt-3 mb-md-0 ps-5 about-text">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras lacinia vitae nibh sed suscipit. Nunc metus lectus, pretium vitae felis rutrum, iaculis convallis ante. Maecenas nec accumsan dolor, vitae cursus magna. 
                        </p><p>
                        Donec pulvinar placerat dolor, eget eleifend ante blandit vitae.Pellentesque elementum vitae ipsum sed volutpat. Phasellus imperdiet ultrices dolor, ut pellentesque nisl blandit in. Pellentesque eget eleifend lacus. Aliquam erat volutpat. Nam ac felis quis purus posuere porta nec sed est. 
                        </p><p>
                        Sed vitae felis elit. Nullam maximus imperdiet elit non lobortis. Duis porta egestas turpis, eu maximus dolor convallis quis. Nam venenatis quam quam, a aliquam augue consequat sit amet.
                        </p><p>
                        Vivamus non rhoncus sapien. In sollicitudin tristique commodo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nunc efficitur odio sit amet lacus malesuada, sit amet ullamcorper lectus mollis. Vivamus gravida a augue in vestibulum. 
                        </p><p>
                        Sed in hendrerit ex, vitae semper lacus. Aliquam semper accumsan molestie. Praesent massa enim, tincidunt a porttitor nec.
                    </p>

                    {/* events button */}
                    <div className="text-center">
                      <Link to="/events">
                        <button className="btn mt-3 about-btn">Our Events</button>
                      </Link>
                    </div>
                </div>

                {/* right side */}
                <div className="col-md-6 d-md-flex justify-content-md-end about-img">
                    <img src="/images/about-img.png" alt="highland game" className="img-fluid"/>
                </div>
            </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
