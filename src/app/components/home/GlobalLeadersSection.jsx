'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function GlobalLeadersSection({ leaders = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (leaders.length === 0) {
    return null;
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? leaders.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === leaders.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full" style={{ backgroundColor: '#07090f' }}>
      {/* Background blur elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute blur-[64px]"
          style={{
            left: '354.25px',
            top: 0,
            width: '384px',
            height: '384px',
            background: 'rgba(21, 93, 252, 0.08)',
            borderRadius: '33554400px',
          }}
        />
        <div
          className="absolute blur-[64px]"
          style={{
            left: '678.75px',
            top: '241.5px',
            width: '384px',
            height: '384px',
            background: 'rgba(79, 57, 246, 0.08)',
            borderRadius: '33554400px',
          }}
        />
      </div>

      {/* Content container */}
      <div className="relative z-10 w-full" style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 32px 32px' }}>
        {/* Header section */}
        <div className="text-center mb-4 w-full">
          {/* Badge */}
          <div
            className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-2 rounded-full border"
            style={{
              background: 'rgba(43, 127, 255, 0.15)',
              borderColor: 'rgba(43, 127, 255, 0.2)',
            }}
          >
            <span
              className="font-semibold text-xs uppercase tracking-widest"
              style={{ color: '#51a2ff', letterSpacing: '1.4px' }}
            >
              Our Global Leaders
            </span>
          </div>

          {/* Main heading */}
          <h2
            className="text-5xl font-extrabold leading-tight tracking-[-1.2px] mb-2"
            style={{
              color: '#ffffff',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 800,
            }}
          >
            <span>Inspiring </span>
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(to right, #51a2ff, #7c86ff)',
              }}
            >
              Minds
            </span>
            <span> Shaping Futures</span>
          </h2>

          {/* Description */}
          <p
            className="max-w-2xl mx-auto text-base leading-relaxed"
            style={{
              color: '#99a1af',
            }}
          >
            Meet the leaders shaping the future of LMS University and inspiring the next generation of learners.
          </p>
        </div>

        {/* Single slide carousel, one leader card visible at a time, image and quote side by side */}
        <div className="relative w-full mb-2 group">
          {/* Stylish side arrows replacing the old bottom prev/next buttons (whose icon assets were mislabeled - icon-prev.svg was a quote glyph, icon-next.svg was a left chevron) */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 z-20 flex items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 hover:-translate-x-1 hover:scale-105"
            style={{
              transform: 'translateY(-50%)',
              width: '48px',
              height: '48px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              cursor: 'pointer',
            }}
            aria-label="Previous leader"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 z-20 flex items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 hover:translate-x-1 hover:scale-105"
            style={{
              transform: 'translateY(-50%)',
              width: '48px',
              height: '48px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              cursor: 'pointer',
            }}
            aria-label="Next leader"
          >
            <ChevronRight size={22} />
          </button>

          {/* overflow-hidden now spans the full wrapper width (no px-16 gutter) so the clip boundary exactly matches where the arrow buttons sit - nothing from the next/prev slide can peek out at the edges */}
          <div className="overflow-hidden w-full">
            <div
              className="flex"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                transition: 'transform 0.4s ease',
              }}
            >
              {leaders.map((leader) => (
                <div
                  key={leader._id}
                  className="flex items-start gap-10 w-full min-w-0 flex-shrink-0 px-4"
                  style={{ minHeight: '300px' }}
                >
                  {/* Leader image */}
                  <div className="relative flex-shrink-0" style={{ width: '260px', height: '300px' }}>
                    {/* Blur glow effect under image */}
                    <div
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 blur-[27.72px]"
                      style={{
                        background: 'rgba(43, 127, 255, 0.4)',
                        width: '200px',
                        height: '40px',
                        borderRadius: '38755332px',
                      }}
                    />
                    {/* overflow-hidden + fill + object-cover so every photo is cropped to the same 260x300 frame, regardless of its own aspect ratio/zoom */}
                    <div className="relative w-full h-full overflow-hidden rounded-2xl">
                      <Image
                        src={leader.image}
                        alt={leader.name}
                        fill
                        className="object-cover object-top"
                        priority
                      />
                    </div>
                  </div>

                  {/* Quote and info - row is items-start so this aligns flush with the image top; min-w-0 lets it actually shrink instead of forcing the row wider than 100% and bleeding the next slide into view */}
                  <div className="flex-1 max-w-xl min-w-0">
                    {leader.quote && (
                      <div
                        className="p-3 rounded-xl border mb-3"
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                          borderWidth: '1.05px',
                        }}
                      >
                        <div className="mb-3 w-6 h-6">
                          <Image
                            src="/images/leaders/icon-quote.svg"
                            alt="Quote"
                            width={25.2}
                            height={25.2}
                          />
                        </div>
                        <p
                          className="text-sm leading-relaxed italic"
                          style={{
                            color: '#d1d5dc',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '13px',
                            fontWeight: 500,
                            fontStyle: 'italic',
                            lineHeight: '21px',
                          }}
                        >
                          &quot;{leader.quote}&quot;
                        </p>
                      </div>
                    )}

                    <p
                      className="text-xs font-bold uppercase tracking-wider mb-2"
                      style={{
                        color: '#51a2ff',
                        fontSize: '12.6px',
                        fontWeight: 700,
                        letterSpacing: '1.26px',
                      }}
                    >
                      {leader.title}
                    </p>
                    <h3
                      className="font-extrabold"
                      style={{
                        color: '#ffffff',
                        fontSize: '20px',
                        fontWeight: 800,
                        lineHeight: '1.3',
                      }}
                    >
                      {leader.name}
                    </h3>

                    {/* Gradient underline moved closer to the name (mt-3 -> mt-1) per feedback: gap was too large */}
                    <div
                      className="mt-1 rounded-full"
                      style={{
                        width: '50.4px',
                        height: '2.1px',
                        background: 'linear-gradient(to right, #2b7fff, #615fff)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination dots only - prev/next now live as side arrows on the carousel itself. mb-25 wasn't a real Tailwind spacing step so it had no effect; replaced with mb-2 to actually tighten the gap */}
        <div className="flex items-center justify-center gap-2 mb-2">
          {leaders.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="h-1.5 rounded-full transition-all cursor-pointer"
              style={{
                width: index === currentIndex ? '32px' : '8px',
                background:
                  index === currentIndex
                    ? '#2b7fff'
                    : 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                transition: 'all 0.3s ease',
              }}
              aria-label={`Go to leader ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}