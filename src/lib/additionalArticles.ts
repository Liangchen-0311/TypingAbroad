import type { Article, Difficulty, Exam, SentenceStructure, VocabularyItem } from "./types";

type LearningNotes = Pick<Article, "vocabulary" | "collocations" | "sentenceStructures">;

interface AdditionalArticleSeed {
  id: string;
  title: string;
  exam: Extract<Exam, "IELTS" | "TOEFL">;
  taskType: string;
  topic: string;
  difficulty: Difficulty;
  estimatedBand?: string;
  text: string;
  learning: LearningNotes;
}

const notes = (
  word: string,
  meaning: string,
  example: string,
  collocations: [string, string, string],
  pattern: string,
  explanation: string,
  template: string,
): LearningNotes => ({
  vocabulary: [{ word, meaning, example } satisfies VocabularyItem],
  collocations,
  sentenceStructures: [{ pattern, explanation, template } satisfies SentenceStructure],
});

function createAdditionalArticle(seed: AdditionalArticleSeed): Article {
  const wordCount = seed.text.trim().split(/\s+/).length;
  const length = wordCount <= 100 ? "Short" : wordCount <= 250 ? "Medium" : "Long";

  return {
    id: seed.id,
    title: seed.title,
    exam: seed.exam,
    taskType: seed.taskType,
    topic: seed.topic,
    difficulty: seed.difficulty,
    estimatedBand: seed.estimatedBand,
    text: seed.text,
    wordCount,
    length,
    tags: [seed.exam, seed.taskType, seed.topic],
    ...seed.learning,
  };
}

export const additionalIeltsArticles: Article[] = [
  createAdditionalArticle({
    id: "ielts-env-011",
    title: "Repairing Products Instead of Replacing Them",
    exam: "IELTS",
    taskType: "Writing Task 2",
    topic: "Environment",
    difficulty: "Medium",
    estimatedBand: "7.5",
    text: `Modern products are often replaced long before their materials stop being useful. A cracked screen, a weak battery, or one unavailable component can turn an expensive device into waste. Consumers do make careless choices, but manufacturers shape those choices through design. When cases are sealed, spare parts are restricted, and repair manuals are withheld, replacement becomes the easiest option.

Governments should require companies to provide parts, instructions, and software support for a reasonable period. Products could also carry a repair score showing how easily common faults can be fixed. Such rules would not force anyone to keep an outdated appliance. They would simply make repair a practical choice when the rest of the product still works.

Repair also creates local employment that cannot easily be moved overseas. Independent technicians, reuse centres, and second-hand sellers all gain value from products with longer lives. The most effective waste policy therefore begins before an item reaches the recycling bin: it ensures that durability and repairability influence how the item is designed in the first place.`,
    learning: notes(
      "repairability",
      "the quality of being easy to repair",
      "A repair score makes repairability visible to buyers.",
      ["spare parts", "local employment", "longer lives"],
      "The most effective waste policy therefore begins before an item reaches the recycling bin.",
      "The sentence redirects attention from disposal to design.",
      "The most effective X begins before Y: it ...",
    ),
  }),
  createAdditionalArticle({
    id: "ielts-tourism-012",
    title: "Tourism in Historic Neighbourhoods",
    exam: "IELTS",
    taskType: "Writing Task 2",
    topic: "Tourism",
    difficulty: "Hard",
    estimatedBand: "8.0",
    text: `Tourism can finance the preservation of historic neighbourhoods, yet unmanaged demand may remove the community that gave those places meaning. Visitor spending supports museums, restaurants, and traditional crafts. It can also persuade governments to restore buildings that might otherwise be neglected. However, apartments converted into short-term accommodation reduce the supply of homes for residents, while shops serving daily needs are gradually replaced by souvenir stores.

Cities should not respond by excluding visitors. A better policy would limit the concentration of holiday rentals, collect a modest overnight charge, and invest the revenue in public spaces and residential services. Tour groups can also be directed toward less crowded routes and scheduled outside the busiest hours. These measures spread the benefit without allowing tourism to dominate every street.

Preservation is not merely the maintenance of attractive walls. A district remains culturally valuable because people live, work, celebrate, and remember there. Tourism is sustainable only when residents retain a genuine stake in the neighbourhood and are not treated as part of the scenery.`,
    learning: notes(
      "concentration",
      "a large amount gathered in one place",
      "The city limited the concentration of holiday rentals.",
      ["historic neighbourhoods", "residential services", "retain a stake"],
      "Preservation is not merely the maintenance of attractive walls.",
      "The writer broadens a narrow definition before giving the real criterion.",
      "X is not merely Y. It also depends on ...",
    ),
  }),
  createAdditionalArticle({
    id: "ielts-edu-013",
    title: "Public Libraries in the Digital Age",
    exam: "IELTS",
    taskType: "Writing Task 2",
    topic: "Education",
    difficulty: "Easy",
    estimatedBand: "7.0",
    text: `The internet has changed what people expect from a library, but it has not removed the need for one. Many books and articles are available online, although access often depends on subscriptions, reliable devices, and digital skills. A public library gives everyone a quiet place to read, use technology, and ask for help.

Libraries can adapt by lending electronic books, offering research workshops, and providing rooms for study or community meetings. Printed collections should remain, especially for children and readers who cannot work comfortably on a screen. The purpose of a library has never been to store paper alone. Its wider role is to make knowledge accessible, and that role becomes more important when useful information is scattered across costly services.`,
    learning: notes(
      "accessible",
      "easy for people to obtain or use",
      "Libraries make reliable information accessible.",
      ["digital skills", "printed collections", "wider role"],
      "The purpose of a library has never been to store paper alone.",
      "This sentence rejects an outdated definition of the institution.",
      "The purpose of X has never been to Y alone.",
    ),
  }),
  createAdditionalArticle({
    id: "ielts-work-014",
    title: "The Four-Day Working Week",
    exam: "IELTS",
    taskType: "Writing Task 2",
    topic: "Work",
    difficulty: "Medium",
    estimatedBand: "7.5",
    text: `A four-day working week is attractive because it promises employees more time without necessarily reducing output. In jobs dominated by meetings, messages, and repeated approval, a shorter week may encourage organisations to remove low-value tasks. Better-rested workers may also concentrate more effectively and take fewer sick days. These gains, however, cannot be assumed in every industry.

Hospitals, transport systems, and customer services must remain available throughout the week. If employers simply compress forty hours into four exhausting days, the policy may increase fatigue rather than reduce it. Trials should therefore measure service quality, workload, staff retention, and productivity instead of celebrating the new schedule by itself.

The strongest case for a shorter week is not that time automatically creates efficiency. It is that a carefully designed limit forces managers to decide which activities are genuinely necessary. Where that redesign succeeds, employees and employers can share the benefit. Where it does not, flexible hours or additional staffing may be a more honest solution.`,
    learning: notes(
      "compress",
      "to fit something into a shorter period",
      "Compressing the same workload may increase fatigue.",
      ["reduce output", "service quality", "staff retention"],
      "If employers simply compress forty hours into four exhausting days, the policy may increase fatigue rather than reduce it.",
      "The conditional sentence exposes a faulty implementation.",
      "If X simply ..., it may increase A rather than reduce it.",
    ),
  }),
  createAdditionalArticle({
    id: "ielts-media-015",
    title: "Advertising Directed at Children",
    exam: "IELTS",
    taskType: "Writing Task 2",
    topic: "Media",
    difficulty: "Hard",
    estimatedBand: "8.0",
    text: `Advertising to children deserves stricter limits because young audiences do not evaluate persuasion in the same way as adults. A child may recognise a familiar character or an exciting prize without understanding that the message has been designed to create demand. Digital advertising makes this distinction even less clear when promotions appear inside games, videos, or recommendations from popular creators.

A complete ban on every commercial message would be difficult to define and enforce. Nevertheless, governments can prohibit targeted advertising based on children's personal data, require obvious labels on paid content, and restrict promotions for products linked to poor health. Platforms should also prevent advertisers from using artificial urgency or social pressure in material likely to reach minors.

Parents still have an important role, but they cannot inspect every message delivered through a connected device. Regulation is justified not because children should be isolated from the marketplace, but because companies possess far more information and persuasive power than the people they target. Clear limits would make that imbalance less damaging.`,
    learning: notes(
      "persuasion",
      "the act of influencing what someone believes or does",
      "Children may not recognise commercial persuasion.",
      ["young audiences", "paid content", "artificial urgency"],
      "Regulation is justified not because children should be isolated from the marketplace, but because companies possess far more information.",
      "The structure rejects one reason and replaces it with a stronger one.",
      "X is justified not because A, but because B.",
    ),
  }),
  createAdditionalArticle({
    id: "ielts-society-016",
    title: "Building Denser Urban Housing",
    exam: "IELTS",
    taskType: "Writing Task 2",
    topic: "Society",
    difficulty: "Hard",
    estimatedBand: "8.0",
    text: `Cities facing a housing shortage often have to choose between building outward and allowing greater density in established areas. Expansion at the edge may provide larger homes, but it also consumes farmland and creates long journeys to work. Well-planned density can place more residents near existing transport, schools, and services. The difficulty is that additional homes do not automatically produce a liveable neighbourhood.

Planning rules should permit apartments of different sizes while requiring daylight, ventilation, trees, and shared outdoor space. Infrastructure must grow with the population; otherwise, crowded clinics and classrooms will turn public opinion against new housing. Local residents should be able to influence street design and community facilities, although they should not have an unlimited right to prevent newcomers from finding a home.

Density is best understood as a design challenge rather than a numerical target. A tall building isolated beside a motorway may use land efficiently on paper but serve its residents poorly. A mixed neighbourhood with safe streets and frequent public transport can accommodate growth while remaining a place in which people want to stay.`,
    learning: notes(
      "accommodate",
      "to provide enough space or capacity for something",
      "The neighbourhood can accommodate population growth.",
      ["housing shortage", "shared outdoor space", "public opinion"],
      "Density is best understood as a design challenge rather than a numerical target.",
      "The comparison reframes the central issue.",
      "X is best understood as A rather than B.",
    ),
  }),
  createAdditionalArticle({
    id: "ielts-edu-017",
    title: "Volunteering as a Graduation Requirement",
    exam: "IELTS",
    taskType: "Writing Task 2",
    topic: "Education",
    difficulty: "Medium",
    estimatedBand: "7.5",
    text: `Requiring students to volunteer before graduation can introduce them to needs beyond the classroom. Work with a food bank, environmental group, or care home may develop reliability and show how local institutions operate. Schools also benefit when academic learning is connected to practical responsibility. Yet compulsory service can become a meaningless exercise if students are asked only to collect a fixed number of hours.

A successful programme should offer several forms of participation, including projects that can be completed from home by students with health or caring constraints. Preparation and reflection matter as much as attendance. Students should understand the organisation's purpose, receive appropriate supervision, and explain what they learned after the placement.

The goal is not to claim that forced generosity is the same as voluntary commitment. It is to ensure that every student encounters a structured opportunity to contribute. If schools protect choice within the requirement, community service can be educational without pretending that all students have identical time and abilities.`,
    learning: notes(
      "constraints",
      "limits that restrict what someone can do",
      "The programme considered students with caring constraints.",
      ["practical responsibility", "appropriate supervision", "structured opportunity"],
      "Preparation and reflection matter as much as attendance.",
      "The comparison gives equal weight to less visible parts of the activity.",
      "A and B matter as much as C.",
    ),
  }),
  createAdditionalArticle({
    id: "ielts-culture-018",
    title: "Hosting International Sporting Events",
    exam: "IELTS",
    taskType: "Writing Task 2",
    topic: "Culture",
    difficulty: "Medium",
    estimatedBand: "7.5",
    text: `International sporting events can create a rare sense of shared celebration, but their public value depends on decisions made long before the opening ceremony. Visitors support local businesses, volunteers gain experience, and athletes can inspire wider participation in sport. New transport or public spaces may also benefit residents for decades. These outcomes are possible rather than guaranteed.

Host cities sometimes build spectacular venues without a realistic plan for later use. Construction deadlines can weaken cost control, while residents displaced from redevelopment areas may receive little benefit from the finished event. Governments should therefore publish complete budgets, reuse existing facilities where possible, and identify the future operator of every new venue before construction begins.

Success should not be measured only by television audiences or medals. A responsible event leaves useful infrastructure, transparent accounts, and sports programmes that remain affordable after international attention has moved elsewhere. If those conditions cannot be met, spending public money on smaller local facilities may produce a more durable legacy.`,
    learning: notes(
      "legacy",
      "a lasting result left by an event or action",
      "The city wanted the event to leave a durable legacy.",
      ["shared celebration", "cost control", "complete budgets"],
      "These outcomes are possible rather than guaranteed.",
      "The sentence prevents the preceding benefits from becoming an overclaim.",
      "These outcomes are possible rather than guaranteed.",
    ),
  }),
  createAdditionalArticle({
    id: "ielts-task1-019",
    title: "Household Energy Use, 1995–2025",
    exam: "IELTS",
    taskType: "Writing Task 1",
    topic: "Environment",
    difficulty: "Medium",
    estimatedBand: "7.5",
    text: `The table shows how an average household distributed its annual energy use among heating, water heating, appliances, lighting, and cooling in 1995, 2010, and 2025. Overall, space heating remained the largest category, although its share declined substantially. By contrast, appliances accounted for a growing proportion of consumption.

In 1995, heating represented forty-eight percent of household energy use. This figure fell to forty-one percent in 2010 and thirty-four percent in 2025. Water heating also decreased, but more gradually, from twenty-two to eighteen percent across the period. Appliance use moved in the opposite direction, rising from sixteen percent in 1995 to twenty-eight percent in 2025. Lighting remained broadly stable at about eight percent. Cooling was the smallest category initially, at six percent, before increasing to twelve percent in the final year.`,
    learning: notes(
      "substantially",
      "by a large or noticeable amount",
      "The share of heating declined substantially.",
      ["largest category", "growing proportion", "broadly stable"],
      "Water heating also decreased, but more gradually, from twenty-two to eighteen percent.",
      "The adverb qualifies the rate of change while the figures provide evidence.",
      "X also decreased, but more gradually, from A to B.",
    ),
  }),
  createAdditionalArticle({
    id: "ielts-task1-020",
    title: "How Glass Bottles Are Recycled",
    exam: "IELTS",
    taskType: "Writing Task 1",
    topic: "Environment",
    difficulty: "Easy",
    estimatedBand: "7.0",
    text: `The diagram illustrates a circular process for recycling used glass bottles. Overall, the procedure contains seven main stages, beginning with household collection and ending when newly filled bottles return to shops.

First, consumers place empty bottles in separate collection bins. The glass is transported to a recycling plant, where workers and machines remove unsuitable material and sort the bottles by colour. The selected glass is then crushed into small pieces and washed. Next, these pieces are heated in a furnace until they become liquid. The recycled glass is mixed with a limited amount of new material and shaped in moulds to produce clean bottles. Finally, manufacturers fill and label the containers before delivering them to retailers. After the products have been used, the bottles can enter the same cycle again.`,
    learning: notes(
      "moulds",
      "shaped containers used to form a material",
      "Liquid glass is shaped in moulds.",
      ["circular process", "unsuitable material", "enter the cycle"],
      "Overall, the procedure contains seven main stages, beginning with household collection and ending when newly filled bottles return to shops.",
      "The overview states the number of stages and both endpoints.",
      "Overall, the process contains X stages, beginning with A and ending with B.",
    ),
  }),
];

export const additionalToeflArticles: Article[] = [
  createAdditionalArticle({
    id: "toefl-discuss-006",
    title: "Should Professors Record Every Lecture?",
    exam: "TOEFL",
    taskType: "Academic Discussion",
    topic: "Education",
    difficulty: "Easy",
    text: `Professors should usually record lectures because recordings give students a reliable way to review difficult explanations. They are especially valuable for learners working in a second language and for students who miss class because of illness. However, a recording should support attendance rather than replace the entire course. Discussions, laboratory work, and immediate questions lose much of their value when watched later. Instructors can protect participation by recording the main presentation while leaving small-group conversation unrecorded. They should also provide captions and remove files after the course so that an old explanation is not shared without context. This approach makes teaching more accessible without pretending that watching a video is identical to joining a class.`,
    learning: notes(
      "accessible",
      "available and usable by more people",
      "Captions make recorded lectures more accessible.",
      ["review explanations", "protect participation", "without context"],
      "A recording should support attendance rather than replace the entire course.",
      "The sentence distinguishes a supporting tool from a substitute.",
      "X should support Y rather than replace it.",
    ),
  }),
  createAdditionalArticle({
    id: "toefl-discuss-007",
    title: "Car-Free Streets in City Centers",
    exam: "TOEFL",
    taskType: "Academic Discussion",
    topic: "Transportation",
    difficulty: "Medium",
    text: `City governments should create car-free streets in busy centers when public transportation and delivery access are planned first. Removing through traffic can reduce noise, improve air quality, and give restaurants and shops more usable space. Pedestrians also tend to spend more time in an area that feels safe. The policy can still harm people if it simply moves congestion to nearby residential streets or makes essential trips impossible for disabled residents. Cities should begin with a limited district, permit timed commercial deliveries, and monitor travel patterns before expanding it. Better bus routes and protected bicycle connections must be part of the same project. A car-free zone succeeds when it improves access to the center, not merely when it excludes one form of transport.`,
    learning: notes(
      "congestion",
      "a condition in which traffic is crowded and slow",
      "The plan should not move congestion to nearby streets.",
      ["through traffic", "essential trips", "travel patterns"],
      "A car-free zone succeeds when it improves access to the center, not merely when it excludes one form of transport.",
      "The contrast defines success by the outcome rather than the rule.",
      "X succeeds when it A, not merely when it B.",
    ),
  }),
  createAdditionalArticle({
    id: "toefl-email-008",
    title: "Recommending an International Student Event",
    exam: "TOEFL",
    taskType: "Write an Email",
    topic: "Campus Life",
    difficulty: "Easy",
    text: `Subject: Recommendation for Next Month's Student Event

Dear Ms. Rivera,

Thank you for asking club members to suggest an event for new international students. I recommend organizing a conversation and culture exchange in the student center.

Participants could join small tables, introduce a tradition from their home region, and discuss a different campus topic every fifteen minutes. This format would give new students an easy way to meet people without requiring a formal presentation. The club could provide name tags, simple discussion questions, and light refreshments. We should also invite several returning students who can answer practical questions about classes and campus services.

Friday evening would probably attract the most participants because fewer students have classes then. I would be happy to help prepare the discussion cards and welcome guests at the entrance.

Best regards,
Nora`,
    learning: notes(
      "participants",
      "people who take part in an activity",
      "The event could attract many participants.",
      ["culture exchange", "practical questions", "light refreshments"],
      "I recommend organizing a conversation and culture exchange in the student center.",
      "The sentence gives a direct recommendation while maintaining a polite tone.",
      "I recommend organizing X because it would Y.",
    ),
  }),
  createAdditionalArticle({
    id: "toefl-discuss-009",
    title: "Public Funding for Museums",
    exam: "TOEFL",
    taskType: "Academic Discussion",
    topic: "Culture",
    difficulty: "Medium",
    text: `Museums deserve some public funding when they provide benefits that admission fees alone cannot support. Conserving fragile objects, maintaining accurate records, and offering school programs all serve people who may never buy a full-price ticket. Public money can also keep basic admission affordable. Funding should not remove accountability, however. Museums receiving support should publish how they select exhibitions, make part of their collection available digitally, and work with communities whose histories they present. Commercial sponsorship can pay for popular shows, but it is less dependable for archives or conservation work that attracts little attention. A mixed model is therefore strongest: ticket sales and donations reward public interest, while stable public funds protect educational and preservation duties that extend beyond the current visitor count.`,
    learning: notes(
      "accountability",
      "the duty to explain decisions and accept responsibility",
      "Public support should come with accountability.",
      ["fragile objects", "commercial sponsorship", "preservation duties"],
      "Commercial sponsorship can pay for popular shows, but it is less dependable for archives.",
      "The contrast shows why two funding sources serve different needs.",
      "A can fund X, but it is less dependable for Y.",
    ),
  }),
  createAdditionalArticle({
    id: "toefl-email-010",
    title: "Reporting a Dormitory Maintenance Problem",
    exam: "TOEFL",
    taskType: "Write an Email",
    topic: "Campus Life",
    difficulty: "Medium",
    text: `Subject: Heating Problem in Cedar Hall, Room 314

Dear Housing Office,

I am writing to report a problem with the heater in Room 314 of Cedar Hall. It turns on for a few minutes and then stops, even when the room temperature is well below the setting on the control panel. My roommates and I first noticed the problem on Monday, and resetting the unit has not solved it.

The room becomes particularly cold at night, so we would appreciate an inspection as soon as possible. At least one of us will be available after 3:00 p.m. on Wednesday and Thursday. If a technician needs to enter at another time, please email us in advance so that we can secure our belongings and arrange access.

Could you also let us know when we should expect the repair? Thank you for your help.

Sincerely,
Daniel Kim`,
    learning: notes(
      "inspection",
      "a careful examination to identify a problem",
      "The residents requested an inspection of the heater.",
      ["control panel", "arrange access", "expect the repair"],
      "If a technician needs to enter at another time, please email us in advance.",
      "The conditional request explains what action is needed and why.",
      "If X needs to happen, please Y in advance.",
    ),
  }),
  createAdditionalArticle({
    id: "toefl-discuss-011",
    title: "Taking a Gap Year Before University",
    exam: "TOEFL",
    taskType: "Academic Discussion",
    topic: "Education",
    difficulty: "Easy",
    text: `A gap year can be useful when a student has a clear plan for it. Paid work may build independence, travel can develop cultural awareness, and structured service can expose a student to possible careers. The year becomes less valuable when it is treated only as an escape from making decisions. Schools could help by asking students to set two or three goals, keep a simple record of their experience, and explain how it affected their later choices. Universities should also allow admitted students to delay enrollment without requiring a new application. A gap year is not appropriate for everyone, and some students may prefer to maintain academic momentum. Its value depends on purposeful activity, not on the length of the break itself.`,
    learning: notes(
      "momentum",
      "the force that keeps an activity developing",
      "Some students prefer to maintain academic momentum.",
      ["cultural awareness", "delay enrollment", "purposeful activity"],
      "Its value depends on purposeful activity, not on the length of the break itself.",
      "The sentence identifies the condition that matters most.",
      "The value of X depends on A, not on B.",
    ),
  }),
  createAdditionalArticle({
    id: "toefl-email-012",
    title: "Asking a Librarian for Research Help",
    exam: "TOEFL",
    taskType: "Write an Email",
    topic: "Research",
    difficulty: "Medium",
    text: `Subject: Help Finding Sources on Urban Agriculture

Dear Ms. Lee,

I am preparing a paper on whether community gardens improve access to fresh food in low-income neighborhoods. I have found several news articles, but my professor requires at least three peer-reviewed studies that compare conditions before and after a garden opens.

I searched the university database using the terms urban agriculture, food access, and community health. Most of the results describe individual programs without measuring their effects over time. Could you recommend another database or a more precise set of search terms? Studies from any country would be useful as long as the methods are clearly explained.

If possible, I would also like to meet for fifteen minutes this week to review my search strategy. I am available Tuesday morning or Wednesday after 2:00 p.m. Thank you for any guidance you can provide.

Best regards,
Sofia Martinez`,
    learning: notes(
      "peer-reviewed",
      "evaluated by experts in the same academic field",
      "The assignment requires peer-reviewed studies.",
      ["search terms", "search strategy", "clearly explained"],
      "Could you recommend another database or a more precise set of search terms?",
      "The modal question makes a specific request politely.",
      "Could you recommend X or a more precise Y?",
    ),
  }),
  createAdditionalArticle({
    id: "toefl-discuss-013",
    title: "Using AI Feedback in Writing Courses",
    exam: "TOEFL",
    taskType: "Academic Discussion",
    topic: "Technology",
    difficulty: "Medium",
    text: `AI feedback can help writing students if it is used between drafts and evaluated critically. A tool can identify repeated words, unclear transitions, or sentences that may need revision. Immediate suggestions also let students experiment before meeting an instructor. The risk is that fluent advice can sound correct even when it misunderstands the writer's purpose or invents a rule. Students should therefore submit a short revision note explaining which suggestions they accepted, which they rejected, and why. Teachers can assess the reasoning behind those choices rather than pretending the tool was absent. AI should widen the opportunity to revise, not remove the student's responsibility for the final argument. Courses that make this responsibility visible can teach both writing and careful judgment.`,
    learning: notes(
      "critically",
      "in a way that carefully judges strengths and weaknesses",
      "Students should evaluate automated feedback critically.",
      ["between drafts", "unclear transitions", "revision note"],
      "AI should widen the opportunity to revise, not remove the student's responsibility for the final argument.",
      "The contrast sets a useful boundary for the technology.",
      "X should widen A, not remove B.",
    ),
  }),
  createAdditionalArticle({
    id: "toefl-email-014",
    title: "Inviting a Classmate to a Study Group",
    exam: "TOEFL",
    taskType: "Write an Email",
    topic: "Education",
    difficulty: "Easy",
    text: `Subject: Biology Study Group on Thursday

Hi Sam,

A few students from our biology class are meeting in the library on Thursday evening to prepare for next week's midterm. Would you like to join us?

We plan to review the cell division diagrams first and then compare answers to the practice questions Professor Harris posted. Each person will bring one topic that they find difficult, so we can spend more time on the areas that need the most attention. The meeting will begin at 6:30 p.m. in Study Room 4 and should last about ninety minutes.

If Thursday does not work for you, I can send you our notes afterward. Please let me know by Wednesday because the room allows only six people.

Best,
Lena`,
    learning: notes(
      "midterm",
      "an examination held near the middle of a course",
      "The class is preparing for next week's midterm.",
      ["practice questions", "study room", "review the diagrams"],
      "If Thursday does not work for you, I can send you our notes afterward.",
      "The conditional keeps the invitation helpful even if the recipient cannot attend.",
      "If X does not work for you, I can Y.",
    ),
  }),
  createAdditionalArticle({
    id: "toefl-discuss-015",
    title: "Reducing Food Waste on Campus",
    exam: "TOEFL",
    taskType: "Academic Discussion",
    topic: "Environment",
    difficulty: "Easy",
    text: `Universities can reduce dining-hall waste by changing how food is served before asking students to behave differently. Smaller default portions with free second servings prevent unwanted food from reaching a plate. Kitchens can also track which dishes are regularly discarded and prepare less of them. Clear date labels would help staff distinguish food that is unsafe from food that can still be donated. Student campaigns may raise awareness, but posters alone rarely change a system that rewards overproduction. The campus should publish a simple monthly measure of purchased, served, donated, and discarded food. Visible data would allow each dining hall to test changes and compare results. Waste becomes easier to reduce when responsibility is connected to specific decisions rather than assigned vaguely to everyone.`,
    learning: notes(
      "discarded",
      "thrown away because it is no longer wanted",
      "The kitchen measured how much food was discarded.",
      ["default portions", "raise awareness", "visible data"],
      "Waste becomes easier to reduce when responsibility is connected to specific decisions rather than assigned vaguely to everyone.",
      "The condition links accountability to measurable action.",
      "X becomes easier when A is connected to B rather than C.",
    ),
  }),
  createAdditionalArticle({
    id: "toefl-email-016",
    title: "Responding to a Volunteer Schedule Change",
    exam: "TOEFL",
    taskType: "Write an Email",
    topic: "Community",
    difficulty: "Medium",
    text: `Subject: Re: New Start Time for Saturday's River Cleanup

Dear Mr. Okafor,

Thank you for letting volunteers know that Saturday's cleanup will now begin at 7:00 a.m. Unfortunately, the first campus bus does not reach Riverside Park until 7:40, so several student volunteers may be unable to arrive on time.

Would it be possible for our group to take responsibility for sorting supplies at the student center before traveling to the park? We could prepare gloves, bags, and safety materials on Friday evening, then join the cleanup when the bus arrives. Another option would be to arrange one pickup near campus if a project vehicle is available.

There are eight students in our group, and all of us still want to participate. Please let me know which solution would be more useful. I can confirm everyone's attendance and organize the supply team today.

Sincerely,
Ethan Wu`,
    learning: notes(
      "participate",
      "to take part in an activity",
      "All eight students still want to participate.",
      ["sorting supplies", "arrange a pickup", "confirm attendance"],
      "Would it be possible for our group to take responsibility for sorting supplies?",
      "The question proposes a solution respectfully instead of only describing a problem.",
      "Would it be possible for us to take responsibility for X?",
    ),
  }),
  createAdditionalArticle({
    id: "toefl-discuss-017",
    title: "Are Open-Book Exams Better?",
    exam: "TOEFL",
    taskType: "Academic Discussion",
    topic: "Education",
    difficulty: "Medium",
    text: `Open-book exams are better for courses that emphasize applying ideas rather than recalling isolated facts. Students can consult a formula or definition, so questions must ask them to compare evidence, solve a new problem, or justify a decision. This resembles professional work, where access to information does not remove the need for judgment. An open-book format is not automatically easier. Students who spend the entire exam searching may perform worse than those who understand how concepts fit together. Instructors should provide a practice question and state which resources are allowed so that the assessment measures knowledge instead of rule interpretation. Closed-book quizzes can still be useful for essential vocabulary or procedures. The exam format should follow the learning goal, not a general belief that one kind of memory is always more rigorous.`,
    learning: notes(
      "rigorous",
      "careful, exact, and demanding",
      "A different format can still be academically rigorous.",
      ["isolated facts", "justify a decision", "learning goal"],
      "The exam format should follow the learning goal, not a general belief that one kind of memory is always more rigorous.",
      "The sentence places purpose above convention.",
      "The format should follow A, not a general belief that B.",
    ),
  }),
  createAdditionalArticle({
    id: "toefl-email-018",
    title: "Requesting an Internship Schedule Adjustment",
    exam: "TOEFL",
    taskType: "Write an Email",
    topic: "Work",
    difficulty: "Hard",
    text: `Subject: Request to Adjust My Tuesday Internship Hours

Dear Ms. Bennett,

I am writing about a scheduling conflict that begins next week. My university has moved a required research seminar from Thursday to Tuesday morning, which overlaps with the first two hours of my internship shift. Because the seminar is required for graduation, I cannot attend it at another time.

Would it be possible for me to begin at 11:00 a.m. on Tuesdays and stay until 7:00 p.m.? This change would preserve my total weekly hours and allow me to remain available for the afternoon client meetings. I can also review urgent messages remotely before the seminar if the team needs an earlier response.

The new seminar schedule will continue for six weeks. After that, I can return to my usual hours. I apologize for the short notice and am happy to discuss another arrangement that better supports the team's work.

Thank you for considering this request.

Best regards,
Priya Shah`,
    learning: notes(
      "overlaps",
      "happens at the same time as another event",
      "The seminar overlaps with the internship shift.",
      ["scheduling conflict", "weekly hours", "short notice"],
      "Would it be possible for me to begin at 11:00 a.m. on Tuesdays and stay until 7:00 p.m.?",
      "The question requests a precise change while showing how lost time will be recovered.",
      "Would it be possible for me to begin at X and stay until Y?",
    ),
  }),
  createAdditionalArticle({
    id: "toefl-discuss-019",
    title: "Should Universities Guarantee Housing?",
    exam: "TOEFL",
    taskType: "Academic Discussion",
    topic: "Society",
    difficulty: "Medium",
    text: `Universities should guarantee first-year students access to reasonably priced housing when the local rental market is difficult. New students are learning how to manage courses, transportation, and finances at the same time. A stable home close to campus removes one avoidable source of disruption and helps international students who cannot inspect apartments in person. A guarantee does not require every university to build luxury dormitories. Institutions can renovate older rooms, partner with nonprofit housing providers, or reserve units in existing buildings. Prices and contract terms should be published before students accept an admission offer. After the first year, housing support can focus on students with financial or accessibility needs. Universities cannot solve an entire city's shortage, but they should not recruit more newcomers than the surrounding area can realistically house.`,
    learning: notes(
      "disruption",
      "a problem that interrupts normal activity",
      "Stable housing removes a source of disruption.",
      ["rental market", "contract terms", "accessibility needs"],
      "Universities cannot solve an entire city's shortage, but they should not recruit more newcomers than the surrounding area can realistically house.",
      "The sentence admits a limit while defining institutional responsibility.",
      "X cannot solve all of A, but it should not B.",
    ),
  }),
  createAdditionalArticle({
    id: "toefl-email-020",
    title: "Proposing a Safer Evening Bus Stop",
    exam: "TOEFL",
    taskType: "Write an Email",
    topic: "Transportation",
    difficulty: "Hard",
    text: `Subject: Proposal to Relocate the Evening Campus Bus Stop

Dear Transportation Committee,

I would like to suggest moving the evening bus pickup from the east parking lot to the main library entrance. The current stop is poorly lit and separated from occupied buildings after 9:00 p.m. Students who leave late classes often wait there alone, and the narrow sidewalk makes it difficult for drivers to see people approaching.

The library entrance would be safer because it has bright lighting, security staff, and a covered waiting area. It is only a two-minute drive from the existing route, so the change should not significantly affect the timetable. The bus could continue using the east lot during the day, when traffic near the library is heavier, and move to the new stop after 8:00 p.m.

Could the committee test this arrangement for one month and collect feedback from riders and drivers? I would be glad to help publicize the trial through the student association.

Sincerely,
Owen Brooks`,
    learning: notes(
      "relocate",
      "to move something to a different place",
      "The student proposed relocating the evening bus stop.",
      ["covered waiting area", "existing route", "collect feedback"],
      "Could the committee test this arrangement for one month and collect feedback from riders and drivers?",
      "The request proposes a limited trial and a way to evaluate it.",
      "Could X test this arrangement for Y and collect feedback from Z?",
    ),
  }),
];
