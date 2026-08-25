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
    id: "toefl-integrated-008",
    title: "Can Coral Nurseries Restore a Reef?",
    exam: "TOEFL",
    taskType: "Integrated Writing",
    topic: "Biology",
    difficulty: "Hard",
    text: `The reading argues that coral nurseries can restore the damaged Maren Reef quickly. It claims that nursery-grown fragments have high survival rates, that fast-growing coral will rebuild habitat, and that local tourism can finance the project. The lecturer considers these conclusions too optimistic.

First, survival in a protected nursery does not predict survival after coral is moved to warmer open water. A recent trial lost most fragments during a single heat event. Second, the species that grows fastest has a simple shape and supports fewer fish than the slow-growing corals that once dominated the reef. Covering the seabed with one species may increase coral area without restoring the former ecosystem.

Finally, tourism revenue changes sharply from season to season. Dive operators have offered equipment and volunteers, but not the stable funding required for years of monitoring. The lecturer does not reject nurseries completely. Instead, she presents them as one limited tool that must be combined with water-quality controls, diverse species, and long-term public support.`,
    learning: notes(
      "fragments",
      "small pieces broken or taken from a larger whole",
      "The nursery grows small coral fragments.",
      ["survival rates", "heat event", "stable funding"],
      "Covering the seabed with one species may increase coral area without restoring the former ecosystem.",
      "The sentence separates a simple measure from the deeper objective.",
      "Doing X may increase A without restoring B.",
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
    id: "toefl-integrated-010",
    title: "How Desert Bees Navigate",
    exam: "TOEFL",
    taskType: "Integrated Writing",
    topic: "Biology",
    difficulty: "Hard",
    text: `The reading proposes that desert bees return to their nests mainly by following the position of the sun. Three observations appear to support this solar-navigation theory. The lecturer argues that the evidence instead points to a combination of landmarks and scent.

The reading first notes that bees leave the nest in different directions as the sun moves. The lecturer explains that flower locations also change during the day, so departure direction does not reveal the method used to return. Second, researchers once placed a screen over a nesting area and found that bees became disoriented. According to the lecturer, the screen hid nearby rocks and plants in addition to the sky, making the result ambiguous.

Finally, the reading describes bees arriving near the correct nest even after being transported in dark boxes. New experiments show that those bees search in wide circles until they approach familiar ground. They then fly directly toward the entrance, where a distinctive colony scent provides the final cue. Thus, sunlight may contribute to a rough sense of direction, but it cannot by itself explain the bees' precise return.`,
    learning: notes(
      "ambiguous",
      "open to more than one interpretation",
      "The screen experiment produced an ambiguous result.",
      ["position of the sun", "became disoriented", "final cue"],
      "Sunlight may contribute to a rough sense of direction, but it cannot by itself explain the bees' precise return.",
      "The concession allows a limited role while rejecting the full claim.",
      "X may contribute to A, but it cannot by itself explain B.",
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
    id: "toefl-integrated-012",
    title: "Why the Port of Bellara Lost Trade",
    exam: "TOEFL",
    taskType: "Integrated Writing",
    topic: "History",
    difficulty: "Hard",
    text: `The reading claims that the ancient port of Bellara lost trade after a rival kingdom blocked its harbor. It cites a defensive wall, a sudden decline in imported pottery, and written complaints about foreign ships. The lecturer argues that environmental change offers a better explanation.

The wall was constructed nearly a century before the decline and protected the town from seasonal flooding as well as attack. It therefore does not prove that a blockade occurred. The pottery evidence is also incomplete. Local workshops began producing similar containers at the same time, so fewer imported vessels may show substitution rather than reduced trade.

As for the written complaints, a new translation indicates that the ships were delayed by shallow water, not stopped by enemies. Sediment had gradually filled the northern harbor. Large vessels then moved to a deeper port twenty kilometers away, while smaller boats continued to serve Bellara. This pattern explains why regional trade survived even as the town's own warehouses became less important. The lecture therefore connects Bellara's decline to a changing coastline rather than military action.`,
    learning: notes(
      "substitution",
      "the replacement of one thing with another",
      "Local pottery may explain the substitution of imported vessels.",
      ["defensive wall", "written complaints", "changing coastline"],
      "Fewer imported vessels may show substitution rather than reduced trade.",
      "The sentence offers a different interpretation of the same evidence.",
      "A decline in X may show A rather than B.",
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
    id: "toefl-integrated-014",
    title: "Reintroducing Wolves to Pine Valley",
    exam: "TOEFL",
    taskType: "Integrated Writing",
    topic: "Ecology",
    difficulty: "Hard",
    text: `The reading predicts that returning wolves to Pine Valley would restore vegetation, control an oversized deer population, and increase tourism. The lecturer says that each benefit is possible but that the reading treats an uncertain experiment as a guaranteed result.

Deer numbers are high, yet wolves may follow easier prey outside the valley during winter. Hunters and severe weather already cause large yearly changes, so researchers cannot assume that wolf predation will stabilize the herd. Vegetation may not recover quickly either. Many riverbanks have lost fertile soil, and young trees will still face drought even if fewer deer eat them.

The lecturer also challenges the tourism claim. Wildlife visitors could bring revenue, but nearby ranchers may face costs if livestock protection is inadequate. A successful program would require compensation, tracking, and staff who respond rapidly when wolves approach farms. These measures are expensive and are missing from the reading's estimate. The lecture concludes that reintroduction should be judged through a limited, monitored trial rather than promoted as an automatic solution to several unrelated problems.`,
    learning: notes(
      "predation",
      "the act of one animal hunting another",
      "Wolf predation may not stabilize the deer herd.",
      ["fertile soil", "livestock protection", "monitored trial"],
      "Each benefit is possible, but the reading treats an uncertain experiment as a guaranteed result.",
      "The sentence concedes possibility while criticizing certainty.",
      "X is possible, but the claim treats A as B.",
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
    id: "toefl-integrated-016",
    title: "Could Brighter Clouds Cool the Coast?",
    exam: "TOEFL",
    taskType: "Integrated Writing",
    topic: "Climate Science",
    difficulty: "Hard",
    text: `The reading supports a proposal to spray fine sea salt above coastal clouds so that they reflect more sunlight. It argues that the method uses a natural material, can be stopped quickly, and would protect coral reefs from extreme heat. The lecturer warns that these points understate the uncertainty.

Although sea salt is natural, producing particles of the required size demands specialized ships and large amounts of energy. Emissions from those vessels could offset part of the cooling benefit. Stopping the spray is also simple only in a mechanical sense. If a region relied on repeated cooling for years, a sudden end could expose ecosystems to a rapid temperature increase.

Finally, cloud changes would not remain neatly above one reef. Winds might alter rainfall in another coastal area, and current models cannot predict that effect precisely. Cooler water could reduce heat stress for coral, but it would not address pollution or ocean acidity. The lecturer therefore recommends small atmospheric studies rather than immediate deployment. The technique may become useful, but the reading has not shown that its regional risks are controllable.`,
    learning: notes(
      "deployment",
      "the act of putting a system into active use",
      "The lecturer opposes immediate deployment of the technique.",
      ["reflect sunlight", "cooling benefit", "regional risks"],
      "Stopping the spray is also simple only in a mechanical sense.",
      "The qualification distinguishes physical control from wider consequences.",
      "Doing X is simple only in a narrow sense.",
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
    id: "toefl-integrated-018",
    title: "The Case for Deep-Sea Mining",
    exam: "TOEFL",
    taskType: "Integrated Writing",
    topic: "Environment",
    difficulty: "Hard",
    text: `The reading claims that collecting mineral nodules from the deep ocean would cause less damage than mining on land. It says that the seabed contains few living organisms, that disturbed areas will recover quickly, and that ocean minerals are essential for clean-energy technology. The lecturer disputes all three arguments.

Recent surveys have found diverse animals living both on and beneath the nodules. Because many species have not yet been identified, current estimates probably understate the ecosystem's complexity. Recovery is also uncertain. Tracks left by experimental equipment several decades ago remain visible, and slow-growing organisms have not returned to their former numbers.

The lecturer finally notes that demand is not fixed. Battery designs are already reducing the amount of certain metals they require, while recycling can recover material from older devices. Land mining has serious costs, but that does not make deep-sea extraction harmless or necessary. Comparing only the excavation sites also ignores sediment clouds that could travel beyond a mining zone. The lecture concludes that commercial activity should wait until scientists understand these wider and potentially irreversible effects.`,
    learning: notes(
      "irreversible",
      "impossible to return to the previous condition",
      "Scientists are concerned about irreversible effects.",
      ["mineral nodules", "former numbers", "sediment clouds"],
      "Land mining has serious costs, but that does not make deep-sea extraction harmless or necessary.",
      "The sentence rejects a false choice between two damaging options.",
      "A has serious costs, but that does not make B harmless.",
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
    id: "toefl-integrated-020",
    title: "Planting Diverse Trees Along City Streets",
    exam: "TOEFL",
    taskType: "Integrated Writing",
    topic: "Urban Ecology",
    difficulty: "Medium",
    text: `The reading recommends planting a single fast-growing tree species throughout Larton because uniform trees are cheaper to purchase, easier to maintain, and create a consistent appearance. The lecturer argues that short-term convenience would produce long-term risk.

Buying one species in bulk may reduce the initial price, but a single pest could then damage nearly every street at once. Replacing thousands of mature trees would cost far more than purchasing a mixed group today. Maintenance is not necessarily simpler either. Trees of the same age often need pruning and replacement at the same time, creating sudden peaks in work.

The lecturer also challenges the visual argument. A diverse planting can still look coherent when planners repeat a limited palette of sizes and leaf colors. Different species bloom and lose their leaves at different times, giving streets shade and interest across a longer season. Diversity also allows each site to receive a tree suited to its soil, available space, and water supply. The lecture therefore favors a coordinated mixture over complete uniformity.`,
    learning: notes(
      "coherent",
      "logically or visually connected as a whole",
      "A diverse planting can still look coherent.",
      ["initial price", "mature trees", "limited palette"],
      "Short-term convenience would produce long-term risk.",
      "The parallel time contrast summarizes the lecturer's objection.",
      "Short-term A may produce long-term B.",
    ),
  }),
];
