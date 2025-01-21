import { Button } from "@/components/ui/button";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import companies from "../../public/data/companies.json";
import accordianData from "../../public/data/faq.json";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


const Landing = () => {
  return (
    <main className="flex flex-col gap-10 py-10 border sm:gap-20 sm:py-20">
      <section className="text-center">
        <h1 className="flex flex-col items-center justify-center py-4 text-4xl font-extrabold tracking-tighter gradient-title sm:text-6xl lg:text-8xl">
          Find your dream job{" "}
          <span className="flex items-center gap-2 lg:gap-6">
            {" "}
            and get{" "}
            <img
              src="https://gedw8ocoh9cdt5ei.public.blob.vercel-storage.com/logo-GoEPnIM0KqqPcIomMKmjyjtBHYLEJY.png"
              alt="Hirrd logo"
              className="h-14 sm:h-24 lg:h-32"
            />
          </span>
        </h1>
        <p className="text-xs text-gray-300 sm:mt-4 sm:text-xl">
          Explore thousands of job listing or find the perfect candidate
        </p>
      </section>
      <div className="flex justify-center gap-6">
        {/* buttons */}
        <Link to="/jobs">
          <Button variant="blue" size="xl">
            Find a job
          </Button>
        </Link>
        <Link to="/post-job">
          <Button variant="destructive" size="xl">
            Post a job
          </Button>
        </Link>
      </div>
      {/* carousel */}

      <Carousel plugins={[Autoplay({ delay: 2000 })]} className="w-full py-10">
        <CarouselContent className="flex items-center gap-5 sm:gap-20">
          {companies.map(({ name, id, path }) => (
            <CarouselItem key={id} className="basis-1/3 lg:basis-1/6">
              <img
                src={path}
                alt={name}
                className="object-contain sm:h-14 h-9"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* banner */}

      <img src="https://gedw8ocoh9cdt5ei.public.blob.vercel-storage.com/banner-5eXcem0XZqo6XNFw9tYLxmmSmigs4j.jpeg" className="w-full" />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* cards */}

        <Card>
          <CardHeader>
            <CardTitle className="font-semibold">For Job seekers</CardTitle>
          </CardHeader>
          <CardContent>
            Search and apply for jobs,track applications and more.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-semibold">For Employers</CardTitle>
          </CardHeader>
          <CardContent>
            Post jobs, manage applications and find the right candidate.
          </CardContent>
        </Card>
      </section>
      {/* accordian */}

      <Accordion type="single" collapsible>
        {accordianData.map((faq,index ) => (
          <AccordionItem key={index} value={`item-${index+1}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent> {faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
};

export default Landing;
