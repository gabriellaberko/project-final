import { useAuthStore } from "../stores/AuthStore";
import { Navigate } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react"
import AutoScroll from "embla-carousel-auto-scroll"
import { ProfileComponent } from "../components/common/ProfileComponent";
import hero from "../assets/hero.jpg"
import plan from "../assets/plan.jpg"
import share from "../assets/share.jpg"
import explore from "../assets/explore.jpg"
import edit from "../assets/edit.jpg"
import mapBg from "../assets/map.png"
import Asako from "../assets/Asako.png"
import Gabriella from "../assets/Gabriella.png"
import Sandra from "../assets/Sandra.png"
import Card from "@mui/material/Card";
import { ScrollReveal } from "../components/common/ScrollReveal";
import { motion } from "framer-motion";


export const PublicHomePage = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [emblaRef1] = useEmblaCarousel({ loop: true}, [
    AutoScroll({ speed: 0.8, stopOnInteraction: false })
  ])
  const [emblaRef2] = useEmblaCarousel({ loop: true, direction: 'rtl' }, [
    AutoScroll({ speed: 0.8, stopOnInteraction: false })
  ])
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const profiles = [{
    name: "Asako",
    imgSrc: Asako,
    altText: "Profile picture of Asako",
    githubLink: "",
    linkedinLink: ""
    }, 
    {
      name: "Gabriella",
      imgSrc: Gabriella,
      altText: "Profile picture of Gabriella",
      githubLink: "",
      linkedinLink: ""
    }, 
    {
      name: "Sandra",
      imgSrc: Sandra,
      altText: "Profile picture of Sandra",
      githubLink: "",
      linkedinLink: ""
    }
  ]

  return (
    <>
      <section className="flex flex-col relative bg-black display-inline-block">
        <img 
          src={hero} 
          alt=""
          className="hero-img opacity-50"
        />
        <div className="absolute right-0 top-10 md:top-auto items-center text-right p-6 md:p-10 w-full md:w-auto">
          <h1 className="text-white text-3xl md:text-4xl font-bold drop-shadow-2xl">Your journey starts here</h1>
          <h2 className="text-white text-lg md:text-xl font-bold drop-shadow-2xl">Plan, share, and explore the world with ease</h2>
          <button
            type="button"
            className="btn mt-6 md:mt-10"
          >
            Register for more!
          </button>
        </div>
      </section>

      <section
        className="my-5 space-y-10 bg-no-repeat bg-center bg-contain p-4 md:p-10"
        style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.2)), url(${mapBg})` }}
      >
        <div className="flex flex-col items-center gap-5">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-center">Trending Destinations</h2>
        </div>
        <div className="embla overflow-hidden" ref={emblaRef1}>
            <div className="embla__container flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <div className="embla__slide flex-[0_0_85%] md:flex-[0_0_30%] min-w-0 px-4" key={`paris-${i}`}>
                  <Card className="p-10 md:p-20 text-center shadow-lg">Paris {i}</Card>
                </div>
              ))}
            </div>
          </div>
        <div className="embla overflow-hidden" ref={emblaRef2} dir="rtl">
            <div className="embla__container flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <div className="embla__slide flex-[0_0_85%] md:flex-[0_0_30%] min-w-0 px-4" key={`nice-${i}`}>
                  <Card className="p-10 md:p-20 text-center shadow-lg">Nice {i}</Card>
                </div>
              ))}
            </div>
          </div>
      </section>

      <section className="flex flex-col gap-10 md:gap-16 mx-auto max-w-6xl px-6 my-10 md:my-20 w-full">
      <ScrollReveal>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-10 text-center">The Ultimate Tool for Your Next Adventure</h2>
        </ScrollReveal>
        <ScrollReveal>
          <div className="about-app flex flex-col md:flex-row items-center gap-8 shadow-[0_4px_15px_#0066D2] bg-white rounded-2xl">
            <div className="app-text flex-1">
              <h3 className="text-xl font-extrabold tracking-tight">Craft Your Perfect Route</h3>
              <p className="mt-4 text-lg">Stop juggling tabs. Map out your entire journey in one intuitive workspace, from hidden gems to must-see landmarks.</p>
            </div>
            <img 
              src={plan} 
              alt=""
              className="app-img w-full md:w-96 h-64 object-cover rounded-lg shadow-md"
            />
          </div>
        </ScrollReveal> 
        <ScrollReveal>
          <div className="about-app flex flex-col md:flex-row items-center gap-8 shadow-[0_4px_15px_#0066D2] bg-white rounded-2xl">
            <img 
              src={share} 
              alt=""
              className="app-img w-full md:w-96 h-64 object-cover rounded-lg shadow-md"
            />
            <div className="app-text flex-1">
              <h3 className="text-xl font-extrabold tracking-tight">Inspire the Community</h3>
              <p className="mt-4 text-lg">Your experiences are valuable. Publish your itineraries to help fellow travelers skip the stress and enjoy the best of every city.</p>
            </div>
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <div className="about-app flex flex-col md:flex-row items-center gap-8 shadow-[0_4px_15px_#0066D2] bg-white rounded-2xl">
            <div className="app-text flex-1">
              <h3 className="text-xl font-extrabold tracking-tight">Never Start from Scratch</h3>
              <p className="mt-4 text-lg ">Browse thousands of real itineraries. Filter by destination or style to find your next adventure, curated by people who’ve been there.</p>
            </div>
            <img 
              src={explore} 
              alt="" 
              className="app-img w-full md:w-96 h-64 object-cover rounded-lg shadow-md"
            />
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <div className="about-app flex flex-col md:flex-row items-center gap-8 shadow-[0_4px_15px_#0066D2] bg-white rounded-2xl">
            <img 
              src={edit} 
              alt="" 
              className="app-img w-full md:w-96 h-64 object-cover rounded-lg shadow-md"
            />
            <div className="app-text flex-1">
              <h3 className="text-xl font-extrabold tracking-tight">Effortless Flexibility</h3>
              <p className="mt-4 text-lg">Plans change, and that’s okay. Drag, drop, and reorganize your schedule instantly, keeping your trip stress-free even on the go.</p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="flex flex-col justify-between items-center p-4 md:p-10 my-10 md:m-20">
        <ScrollReveal>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-10 text-center">Meet the Explorers Behind the App</h2>
        </ScrollReveal>
        <ScrollReveal>
          <div className="flex flex-col md:flex-row justify-around items-center gap-10 md:gap-5">
            {profiles.map((profile) => (
              <ProfileComponent key={profile.name} {...profile} />
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section className="flex flex-col items-center my-10 md:m-20 px-4">
        <ScrollReveal>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-5 text-center">Everything You Need to Know</h2>
        </ScrollReveal>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="flex flex-col self-start justify-between items-center gap-5 w-full"
        >
            <motion.div variants={itemVariants} className="w-full max-w-2xl">
              <p className="q"><b>Q: </b>Does it cost anything to join?</p>
              <p className="a"><b>A: </b>Not at all. You can start planning, sharing, and exploring for free today. We believe great travel should be accessible to everyone.</p>
            </motion.div>
            <motion.div variants={itemVariants} className="w-full max-w-2xl">
              <p className="q"><b>Q: </b>Can I keep my itineraries private?</p>
              <p className="a"><b>A: </b>Of course. You’re in the driver’s seat. Choose to keep your plans private for personal use, or toggle them to public whenever you’re ready to inspire others.</p>
            </motion.div>
            <motion.div variants={itemVariants} className="w-full max-w-2xl">
              <p className="q"><b>Q: </b>Is there a mobile app?</p>
              <p className="a"><b>A: </b>While we’re web-based, our platform is fully optimized for mobile. You can access your plans seamlessly from any browser on your phone while you're out exploring.</p>
            </motion.div>
        </motion.div>
      </section>

      <footer className="text-center p-6">
      © 2026 (App name). All rights reserved.
      </footer>
    </>
  );
};