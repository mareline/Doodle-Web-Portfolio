import { useEffect, useRef, useState } from "react";
import Doodle from "./Doodle";

// Things she says
const FIRST_LINE = "hey there!";
const LINES = [
  "thanks for visiting!",
  "woah!",
  "hey diva :)",
  "heyyyyyyyy",
  "omg, hi!!",
  "omg… I need cafecito",
  "are you bored of clicking yet?",
  "thank you!!",
  "fun fact: my favorite color is purple ♡",
  "fun fact: I love tea",
  "fun fact: my cat’s name is Miso",
  "fun fact: my other cat’s name is Parmy",
  "Miso and Parmy say hi too",
  "tea or cafecito? why not both",
  "purple everything, always",
  "I drew all these doodles myself!",
  "scroll down, there’s more ↓",
  "have you met the cat yet? it’s not Miso, but close",
  "leave me a note at the end ♡",
  "psst… the folders open",
  "yes, I’m still clicking too",
  "hiii again!",
  "okay you really like clicking huh",
  "I’m doing an MBA in Business Data Analytics!",
  "I have a CS degree… and two more majors. I love learning!",
  "product owner by day, doodler by night",
  "I write about video games on Substack!",
  "Silent Hill 2 lives in my head rent free",
  "Resident Evil is the heavy hitter, no debate",
  "Dante from Devil May Cry is pretty iconic",
  "games are just really good products",
  "neurodiversity in tech matters ♡",
  "ask me about mentoring!",
  "a cup of tea fixes most bugs",
  "a cafecito fixes the rest",
  "you found the talking girl!",
  "this whole site is my sketchbook",
  "watch the pencil notes get erased when you scroll!",
  "hire me?",
  "you’re doing amazing sweetie",
  "okay bestie, keep scrolling",
  "woah, still here?",
  "byeee… just kidding, click again",
  "meow meow",
  "*yawn*",
  "I was top 25 Ultron form Marvel Rivals at one point",
  "Rebeccar Chamber is my favorite character!!",
  "I bought Fallout 76 .....3 times..",
  "womp womp",
  "I grow Orchids!",
  "I wore a Moldavite for 3 years",
  "I write poems too!",
  "I really like Vampire games and movies",
  "still clicking huh?",
];

const SHOW_MS = 2800;

const shuffle = (list) => {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};


export default function TalkingFigure({ onPop, className = "" }) {
  const [line, setLine] = useState(null);
  const queue = useRef([]);
  const timer = useRef(0);

  function say(text) {
    clearTimeout(timer.current);
    setLine(text);
    timer.current = setTimeout(() => setLine(null), SHOW_MS);
  }

  useEffect(() => {
    const hello = setTimeout(() => say(FIRST_LINE), 2200); // after the title finishes writing itself
    return () => {
      clearTimeout(hello);
      clearTimeout(timer.current);
    };
  }, []);

  function talk(event) {
    onPop?.(event);
    if (queue.current.length === 0) queue.current = shuffle(LINES);
    say(queue.current.pop());
  }

  return (
    <div className={className}>
      <button type="button" onClick={talk} aria-label="Say hi to the girl" className="block w-full cursor-pointer bg-transparent p-0">
        <Doodle name="figure" priority depth={5} className="pointer-events-none w-full" />
      </button>
      {line && (
        <p
          key={line}
          role="status"
          className="speech-bubble absolute top-full right-[18%] z-30 mt-3 w-max max-w-[min(16rem,70vw)] sm:right-auto sm:left-1/2 sm:-translate-x-1/2 bg-card px-4 py-2 text-center font-hand text-lg leading-snug lg:text-xl"
        >
          {line}
        </p>
      )}
    </div>
  );
}
