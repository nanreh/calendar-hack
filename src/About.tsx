
const About = () => {
    return <>
        <div className="about-container">
            <h3 className="title">About</h3>
            <hr/>

            <p>
            Often, the biggest challenge in running a race is finding the time to train. Having a good training plan is key, but understanding how your running life intersects your non-running life is even more important. After all, you’re not likely to kill that Sunday long run if it follows that Saturday night Phish show. Your training needs to work despite travel you do, work deadlines you face, kid schedules, doctor’s appointments, election days, Maker Faire, visits from out-of-town friends, baseball games, dates, gran fondos, colonoscopies, court appearances—whatever life throws at you is easier to manage when it’s on a calendar.
            </p>
            <p>
            Each time I gear up for a race, I search Google for a way to marry a training plan to my calendar and I’m surprised when nothing comes up. Instead, I do what you probably do: I enter each training run by hand. It’s a collosal waste of time and an easy way add or remove a few miles with a careless fat finger.
            </p>
            <p>
            So to save myself this mundane ritual as I lock in a training schedule for the 2016 Boston Marathon (and many evenings and weekends since), I hacked together a web application that lets me:
            </p>
            <ol>
                <li>Choose the date of my goal race</li>
                <li>Choose a training plan</li>
                <li>Specify miles or km (Hello non-Americans!)</li>
                <li>Download an iCalendar (.ics) file with the right training runs on it</li>
            </ol>
            <p> If you’re not familiar with <a href="https://en.wikipedia.org/wiki/ICalendar" target="_blank">iCalendar</a> files, what you need to know is that you can import them into Google Calendar, the OSX Calendar app, and any other calendar app worth using.</p>
            <p>(If you do use Google Calendar, I recommend creating a new calendar to import into so your training schedule gets its own color and so you can show/hide it as needed.)</p>
            <p>The app knows about some training plans:</p>
            <ul>
                <li>
                    Several plans by Pete Pfitzinger and Scott Douglas from their popular <a href="http://www.amazon.com/Advanced-Marathoning-Edition-Pete-Pfitzinger/dp/0736074600" target="_blank">Advanced Marathoning</a> book
                </li>
                <li>
                    Several plans by Pete Pfitzinger and Philip Latter from their popular <a href="https://www.amazon.com/Faster-Road-Racing-Half-Marathon/dp/1450470459" target="_blank"> Faster Road Racing: 5K to Half Marathon</a> book
                </li>
                <li>
                    Beginner and Advanced Marathon plans by Keith and Kevin Hanson from their popular <a href="https://www.amazon.com/Hansons-Marathon-Method-Your-Fastest/dp/1937715485" target="_blank">Hansons Marathon Method</a> book</li>
                <li>
                    Several plans by Hal Higdon from his popular <a href="http://www.amazon.com/Marathon-Ultimate-Training-Programs-Marathons/dp/1609612248" target="_blank">Marathon: The Ultimate Training Guide</a> book</li>
                <li>A few popular “Couch to 5K” plans for new runners</li>
            </ul>
            <p>I’ve read these books and have trained with programs from them in the past. The plans will make little sense if you don’t take the time to read the books they came from. So, seriously, understand what you’re getting yourself into so you get the most out of your training and don’t hurt yourself.</p>
            <p>The scope of this app is intentionally narrow—it helps get a stock training plan onto your calendar with as little friction as possible. Once it’s on your calendar, by all means adjust the scheduled runs as necessary so your running life doesn’t wreck your non-running life and vice-versa.</p>
            <p>That being said, you can make some minor changes to the plan before you download it:</p>
            <ol>
                <li>Swap any two workouts easily using drag-and-drop: just grab the workout you want to move and drag it where you want it to go.</li>
                <li>Swap all workouts that fall on a given day of the week with workouts on another day of the week: just grab the day of week heading (e.g. “Sunday”) and drop it onto the day you would like to swap with (e.g. “Saturday”).</li>
                <li>An undo button will appear near the top of the screen if you need it.</li>
            </ol>
            <p>Note: These features work best on bigger screens; day-of-week swapping is not currently available on devices with smallest screens.</p>
            <p>Thanks for reading this far. If you find any bugs, have any questions or feedback feel free to get in touch (contact details appear below).</p>
        </div>
    </>
}

export default About;