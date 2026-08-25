import type { Article, Difficulty, Exam, SentenceStructure, VocabularyItem } from "./types";
import { additionalIeltsArticles, additionalToeflArticles } from "./additionalArticles";

type ArticleSeed = Omit<Article, "wordCount" | "length">;

const vocabulary = (word: string, meaning: string, example: string): VocabularyItem => ({ word, meaning, example });
const structure = (pattern: string, explanation: string, template: string): SentenceStructure => ({
  pattern,
  explanation,
  template,
});

function createArticle(seed: ArticleSeed): Article {
  const wordCount = seed.text.trim().split(/\s+/).length;
  const length = wordCount <= 100 ? "Short" : wordCount <= 250 ? "Medium" : "Long";
  return { ...seed, wordCount, length };
}

const ielts = (
  id: string,
  title: string,
  taskType: string,
  topic: string,
  difficulty: Difficulty,
  estimatedBand: string,
  text: string,
  learning: Pick<ArticleSeed, "vocabulary" | "collocations" | "sentenceStructures">,
) =>
  createArticle({
    id,
    title,
    exam: "IELTS",
    taskType,
    topic,
    difficulty,
    estimatedBand,
    text,
    tags: ["IELTS", taskType, topic],
    ...learning,
  });

const other = (
  id: string,
  title: string,
  exam: Exclude<Exam, "IELTS">,
  taskType: string,
  topic: string,
  difficulty: Difficulty,
  text: string,
  learning: Pick<ArticleSeed, "vocabulary" | "collocations" | "sentenceStructures">,
) =>
  createArticle({
    id,
    title,
    exam,
    taskType,
    topic,
    difficulty,
    text,
    tags: [exam, taskType, topic],
    vocabulary: learning.vocabulary,
    collocations: learning.collocations,
    sentenceStructures: learning.sentenceStructures,
  });

export const articles: Article[] = [
  ielts(
    "ielts-tech-001",
    "Technology and Human Communication",
    "Writing Task 2",
    "Technology",
    "Medium",
    "7.5",
    `Digital technology has changed how people maintain relationships across distance. Video calls allow families to share ordinary moments, while online communities help individuals find others with similar interests. These tools can therefore strengthen connections that might otherwise disappear. However, convenient communication is not always meaningful communication. Short messages often replace longer conversations, and people may divide their attention between a screen and the person beside them.

The design of digital services also influences behaviour. Notifications reward immediate replies, public counters turn conversation into competition, and endless feeds remove the natural point at which a person might stop. Individual discipline matters, but companies should also give users practical control. Quiet hours, clear privacy choices, and chronological feeds can help people decide when and how they communicate. Such features do not require users to reject technology; they make intentional use easier.

The effect of technology consequently depends on the habits and systems surrounding it. Schools and families should teach young people to use digital tools deliberately rather than continuously. Workplaces should avoid treating instant availability as evidence of commitment. Public policy can support this effort by requiring clearer controls and meaningful choices instead of long, confusing consent forms. None of these measures will determine how every person behaves, but together they can make sustained attention a realistic option rather than a constant struggle. They can also protect people who lack the time, confidence, or authority to negotiate expectations individually. A shared standard is especially important for children and workers, whose online habits are often shaped by institutions rather than personal preference. Technology is most valuable when it removes a barrier to human contact, not when it becomes a barrier itself. By setting aside devices during meals and important discussions, people can enjoy the reach of online communication without sacrificing the depth of face-to-face relationships.`,
    {
      vocabulary: [
        vocabulary("deliberately", "in a planned and conscious way", "Students should use digital tools deliberately."),
        vocabulary("sacrificing", "giving up something valuable", "Convenience should not require sacrificing meaningful conversation."),
      ],
      collocations: ["maintain relationships", "divide their attention", "remove a barrier"],
      sentenceStructures: [
        structure(
          "Technology is most valuable when it removes a barrier to human contact, not when it becomes a barrier itself.",
          "The ‘X, not Y’ contrast makes the writer’s position precise.",
          "X is most valuable when it ..., not when it ...",
        ),
      ],
    },
  ),
  ielts(
    "ielts-edu-002",
    "Should University Education Be Free?",
    "Writing Task 2",
    "Education",
    "Hard",
    "8.0",
    `Making university education free appears to offer a simple route to greater equality. Students from low-income families would face fewer financial barriers, and graduates could choose socially useful careers without the pressure of large debts. Society would also benefit from a more highly educated workforce. Nevertheless, a universal policy would require governments to subsidise wealthy students as well as those who genuinely need support. This could divert public money from primary schools, vocational training, or healthcare, where additional funding may produce a broader benefit. A more balanced approach is to charge tuition according to a student's ability to pay while providing generous grants for disadvantaged applicants. Governments can also forgive part of a graduate's debt when that person works in an underserved field or region. Such policies preserve access without pretending that higher education has no cost. The central goal should not be free tuition for everyone, but a system in which no capable student is excluded by price.`,
    {
      vocabulary: [
        vocabulary("subsidise", "to pay part of the cost of something", "Governments may subsidise essential training."),
        vocabulary("underserved", "not receiving enough services or support", "New teachers are needed in underserved regions."),
      ],
      collocations: ["financial barriers", "divert public money", "ability to pay"],
      sentenceStructures: [
        structure(
          "The central goal should not be free tuition for everyone, but a system in which no capable student is excluded by price.",
          "A ‘not A, but B’ structure replaces an oversimplified proposal with a more precise aim.",
          "The central goal should not be A, but B.",
        ),
      ],
    },
  ),
  ielts(
    "ielts-env-003",
    "Pricing the Cost of Fossil Fuels",
    "Writing Task 2",
    "Environment",
    "Hard",
    "8.0",
    `Higher taxes on fossil fuels can encourage households and companies to reduce waste, but the policy must be introduced carefully. When petrol, coal, and natural gas become more expensive, renewable energy and efficient transport become relatively attractive. The tax also reflects costs that market prices usually ignore, including air pollution and climate damage. Yet a sudden increase in energy prices can place a disproportionate burden on rural residents and low-income families, who may have few alternatives. Governments should therefore return part of the revenue through targeted rebates and invest the remainder in reliable public transport, home insulation, and clean power. Clear timelines would give industries time to adapt. A carbon tax is not a complete environmental strategy, but it can align everyday financial decisions with long-term public interests. Its fairness depends less on the tax itself than on how the revenue is used.`,
    {
      vocabulary: [
        vocabulary("disproportionate", "too large in relation to something else", "The policy placed a disproportionate burden on small firms."),
        vocabulary("rebates", "partial repayments after a payment has been made", "Targeted rebates can protect poorer households."),
      ],
      collocations: ["reduce waste", "place a burden on", "align decisions with"],
      sentenceStructures: [
        structure(
          "Its fairness depends less on the tax itself than on how the revenue is used.",
          "This comparative frame shifts attention from one factor to another.",
          "X depends less on A than on B.",
        ),
      ],
    },
  ),
  ielts(
    "ielts-gov-004",
    "Public Spending and Preventive Policy",
    "Writing Task 2",
    "Government",
    "Medium",
    "7.5",
    `Governments often spend more on solving visible crises than on preventing them. Hospitals receive emergency funding after patient numbers rise, while public health programmes struggle for stable support. This pattern is understandable because immediate problems attract public attention. However, prevention can be both cheaper and more humane. Safe cycling routes reduce accidents and pollution; early childhood support improves later educational outcomes; and routine screening can identify disease before treatment becomes complex. Preventive policies do not eliminate the need for emergency services, and their benefits may take years to appear. For that reason, governments should publish long-term targets and evaluate programmes with consistent evidence rather than short political cycles. A resilient public system must be able to respond to today's crisis while reducing the likelihood of tomorrow's.`,
    {
      vocabulary: [
        vocabulary("resilient", "able to recover from difficulty", "A resilient health system can respond to unexpected demand."),
        vocabulary("likelihood", "the chance that something will happen", "Education can reduce the likelihood of preventable illness."),
      ],
      collocations: ["stable support", "educational outcomes", "long-term targets"],
      sentenceStructures: [
        structure(
          "Preventive policies do not eliminate the need for emergency services, and their benefits may take years to appear.",
          "The sentence concedes two limits before supporting a measured conclusion.",
          "X does not eliminate Y, and its benefits may ...",
        ),
      ],
    },
  ),
  ielts(
    "ielts-health-005",
    "Designing Cities for Health",
    "Writing Task 2",
    "Health",
    "Easy",
    "7.0",
    `Public health is shaped by streets as well as hospitals. A neighbourhood with safe footpaths, nearby parks, and affordable fresh food makes healthy choices easier. By contrast, residents are less likely to exercise when roads are dangerous or green space is distant. City planners should therefore treat health as part of basic infrastructure. Small changes, such as shaded walking routes and secure bicycle parking, can support daily activity without requiring expensive facilities. Medical care remains essential, but cities can reduce preventable illness by designing ordinary places around human needs.`,
    {
      vocabulary: [vocabulary("infrastructure", "the basic systems a society needs", "Parks can be treated as health infrastructure.")],
      collocations: ["healthy choices", "daily activity", "preventable illness"],
      sentenceStructures: [
        structure("Public health is shaped by streets as well as hospitals.", "‘As well as’ broadens the cause beyond the obvious factor.", "X is shaped by A as well as B."),
      ],
    },
  ),
  ielts(
    "ielts-work-006",
    "Remote Work and Shared Culture",
    "Writing Task 2",
    "Work",
    "Medium",
    "7.5",
    `Remote work gives employees greater control over time and location, yet flexibility alone does not create a healthy workplace. People may save hours of travel and find it easier to manage family responsibilities. Employers can also recruit beyond a single city. At the same time, new staff can struggle to learn informal practices when every conversation must be scheduled. Creative disagreements are also harder to resolve through a sequence of brief messages. Organisations should avoid treating the choice as a contest between home and office. A better model defines which activities require shared space and which require uninterrupted individual time. Teams might meet in person for planning, mentoring, and difficult decisions, then work remotely for tasks that demand concentration. The strongest policy is not the one that offers the most days at home, but the one that gives each kind of work an appropriate setting.`,
    {
      vocabulary: [
        vocabulary("uninterrupted", "continuing without being stopped", "Research often requires uninterrupted time."),
        vocabulary("mentoring", "guidance given by an experienced person", "In-person mentoring helps new employees learn."),
      ],
      collocations: ["manage responsibilities", "informal practices", "demand concentration"],
      sentenceStructures: [
        structure(
          "The strongest policy is not the one that offers the most days at home, but the one that gives each kind of work an appropriate setting.",
          "The contrast evaluates quality rather than quantity.",
          "The strongest X is not the one that ..., but the one that ...",
        ),
      ],
    },
  ),
  ielts(
    "ielts-global-007",
    "Local Identity in a Global Market",
    "Writing Task 2",
    "Globalization",
    "Hard",
    "8.0",
    `Global trade gives consumers access to products and ideas from distant places, but it can also make city centres look increasingly similar. International chains often benefit from large supply networks and recognisable branding, advantages that small local firms cannot easily match. The answer is not to restrict foreign businesses. Competition can improve quality and provide employment. Instead, local governments should protect the conditions in which independent businesses can survive. Fair commercial rents, simple licensing rules, and well-designed public markets can lower the barriers faced by new traders. Schools and cultural institutions also have a role in preserving local knowledge, particularly languages, crafts, and food traditions. Cultural identity is not a museum object that must remain unchanged. It develops through contact with new influences. The challenge is to ensure that this exchange remains two-sided, so that communities contribute to global culture rather than merely consuming a standardised version of it.`,
    {
      vocabulary: [
        vocabulary("standardised", "made the same according to a common model", "A standardised product may ignore local preferences."),
        vocabulary("recognisable", "easy to identify", "The company uses recognisable branding."),
      ],
      collocations: ["supply networks", "lower the barriers", "preserving local knowledge"],
      sentenceStructures: [
        structure(
          "Cultural identity is not a museum object that must remain unchanged.",
          "A concise metaphor rejects the assumption that culture should be frozen.",
          "X is not a museum object that must remain unchanged.",
        ),
      ],
    },
  ),
  ielts(
    "ielts-crime-008",
    "Education After Prison",
    "Writing Task 2",
    "Crime",
    "Medium",
    "7.5",
    `Punishment may protect the public for a period, but education can reduce the chance that an offender returns to crime. Many prisoners have limited qualifications and unstable work histories. If they leave prison with the same skills and fewer opportunities, lawful employment may remain out of reach. Literacy classes, vocational certificates, and carefully supervised work programmes can create a realistic path back into society. Such courses should be demanding and linked to recognised standards; they are not a reward for criminal behaviour. They are a practical investment in public safety. Education cannot address every cause of crime, but it can give people the ability to make a different choice when they are released.`,
    {
      vocabulary: [vocabulary("vocational", "related to skills needed for a particular job", "Vocational courses can lead directly to employment.")],
      collocations: ["lawful employment", "recognised standards", "public safety"],
      sentenceStructures: [
        structure("They are not a reward for criminal behaviour. They are a practical investment in public safety.", "Two short sentences separate a misconception from the main argument.", "X is not a reward for A. It is an investment in B."),
      ],
    },
  ),
  ielts(
    "ielts-media-009",
    "News Literacy in the Classroom",
    "Writing Task 2",
    "Media",
    "Easy",
    "7.0",
    `Students encounter news through videos, messages, and social platforms long before they read a printed newspaper. Schools should therefore teach them how to judge information rather than simply warning them about unreliable sources. A useful lesson might compare several reports of the same event, identify the evidence each report uses, and ask who benefits from a particular interpretation. These habits do not tell students what to believe. They help students pause before sharing a dramatic claim. News literacy belongs beside reading and writing because responsible participation in public life now depends on all three.`,
    {
      vocabulary: [vocabulary("interpretation", "a particular way of understanding something", "The evidence may support more than one interpretation.")],
      collocations: ["judge information", "dramatic claim", "public life"],
      sentenceStructures: [
        structure("These habits do not tell students what to believe. They help students pause before sharing a dramatic claim.", "The second sentence clarifies the practical purpose of the first.", "X does not tell people what to think. It helps them ..."),
      ],
    },
  ),
  ielts(
    "ielts-task1-010",
    "Urban Transport Use, 2000–2025",
    "Writing Task 1",
    "Transportation",
    "Hard",
    "8.0",
    `The chart compares the proportions of commuters using cars, buses, bicycles, and trains in one city between 2000 and 2025. Overall, private cars remained the most common form of transport, although their share fell steadily. Train use showed the opposite pattern and recorded the largest increase. In 2000, sixty-two percent of commuters travelled by car, compared with eighteen percent by bus and only nine percent by train. By 2025, the figure for cars had declined to forty-three percent, while train use had more than doubled to twenty-two percent. Cycling also rose, from eleven to seventeen percent. Bus use changed comparatively little, ending the period at eighteen percent. The data therefore suggest a gradual shift away from private vehicles, driven mainly by rail and, to a lesser extent, bicycles.`,
    {
      vocabulary: [
        vocabulary("proportion", "a part or share of a whole", "The proportion of rail users increased."),
        vocabulary("comparatively", "when compared with something else", "Bus use changed comparatively little."),
      ],
      collocations: ["fell steadily", "showed the opposite pattern", "to a lesser extent"],
      sentenceStructures: [
        structure(
          "Private cars remained the most common form of transport, although their share fell steadily.",
          "‘Although’ combines the dominant feature with an important change.",
          "X remained the most common ..., although its share ...",
        ),
      ],
    },
  ),
  ...additionalIeltsArticles,
  other(
    "toefl-discuss-001",
    "Should Attendance Affect Grades?",
    "TOEFL",
    "Academic Discussion",
    "Education",
    "Easy",
    `Attendance should influence a course grade only when participation is part of the learning objective. In a laboratory, seminar, or language class, students learn by conducting experiments, discussing evidence, or responding to others. Missing these activities means missing work that cannot be reproduced by reading notes. In a large lecture course, however, students may be able to master the same material independently. Penalising absence in that setting can confuse physical presence with actual learning. Professors should explain at the start of a course which activities require attendance and assess those activities directly. A clear policy respects different learning styles while preserving the collaborative work that a class genuinely needs.`,
    {
      vocabulary: [vocabulary("penalising", "punishing someone for an action", "Penalising absence may not measure learning.")],
      collocations: ["learning objective", "master the material", "clear policy"],
      sentenceStructures: [structure("Attendance should influence a course grade only when participation is part of the learning objective.", "‘Only when’ sets a precise condition.", "X should affect Y only when ...")],
    },
  ),
  other(
    "toefl-discuss-002",
    "Funding Basic or Applied Research",
    "TOEFL",
    "Academic Discussion",
    "Science",
    "Medium",
    `Public agencies should maintain a balance between basic and applied research. Applied projects can address an immediate need, such as improving batteries or treating a disease, so their benefits are easy to explain. Basic research asks broader questions without promising a quick commercial result. Nevertheless, many important technologies emerged from investigations that originally had no practical objective. If funding follows only short-term demand, society may lose discoveries whose value cannot yet be predicted. A sensible portfolio would reserve stable funding for foundational work while directing additional resources toward urgent public problems. The two forms of research are not competitors: basic knowledge expands what is possible, and applied research turns some of those possibilities into useful tools.`,
    {
      vocabulary: [vocabulary("foundational", "forming the base on which something develops", "Foundational research supports later innovation.")],
      collocations: ["immediate need", "commercial result", "stable funding"],
      sentenceStructures: [structure("The two forms of research are not competitors: basic knowledge expands what is possible, and applied research turns some of those possibilities into useful tools.", "A colon introduces a concise explanation of the claim.", "A and B are not competitors: A ..., and B ...")],
    },
  ),
  other(
    "toefl-integrated-003",
    "Restoring a Coastal Wetland",
    "TOEFL",
    "Integrated Writing",
    "Environment",
    "Hard",
    `The reading argues that restoring the Greyhaven wetland would be too expensive, would increase mosquito populations, and would reduce land available for farming. The lecturer disputes each concern. First, she explains that the construction estimate includes optional visitor facilities, whereas the essential work of reopening water channels would cost much less. Maintenance would also be limited because tidal water, rather than electric pumps, would sustain the restored system. A regional conservation fund has already offered to cover part of the initial work.

Second, tidal movement would prevent the stagnant pools in which mosquitoes usually breed. Nearby restored wetlands have, in fact, reported fewer mosquitoes because fish returned and consumed the larvae. The reading assumes that every wet area provides suitable breeding conditions, but the lecturer distinguishes a functioning salt marsh from an isolated pool of fresh water.

Finally, the lecturer notes that much of the proposed site produces poor harvests because salt has already entered the soil. Farmers would receive compensation and technical support to improve more productive fields inland. The new wetland could also reduce storm damage by absorbing waves before they reach roads and remaining farms. This protective benefit is absent from the reading's calculation. She adds that restored habitat may support commercial fish populations beyond the project boundary, creating a further economic benefit for coastal residents. The lecture therefore presents restoration not as a loss of useful farmland but as a way to protect the coast while concentrating agriculture in more suitable areas.`,
    {
      vocabulary: [
        vocabulary("stagnant", "not flowing or moving", "Mosquitoes often breed in stagnant water."),
        vocabulary("larvae", "the young form of an insect", "Fish consumed the mosquito larvae."),
      ],
      collocations: ["disputes each concern", "receive compensation", "suitable areas"],
      sentenceStructures: [structure("The lecturer disputes each concern.", "This overview sentence prepares the reader for a point-by-point response.", "The lecturer disputes each claim presented in the reading.")],
    },
  ),
  other(
    "toefl-discuss-004",
    "The Value of Group Projects",
    "TOEFL",
    "Academic Discussion",
    "Society",
    "Medium",
    `Group projects are valuable when the task truly requires more than one perspective. A team can divide research, challenge weak assumptions, and combine different skills. Yet group work becomes unfair when one shared grade hides large differences in effort. Instructors can address this problem by dividing assessment into three parts: the quality of the final product, each student's documented contribution, and a short individual reflection. Teams should also receive time to assign roles and resolve disagreements before the deadline. These measures do not remove every conflict, but they make collaboration part of the learning process rather than a test of who is willing to do the most unpaid work for classmates.`,
    {
      vocabulary: [vocabulary("documented", "recorded in a clear form", "Each student submitted a documented contribution.")],
      collocations: ["weak assumptions", "shared grade", "resolve disagreements"],
      sentenceStructures: [structure("These measures do not remove every conflict, but they make collaboration part of the learning process.", "The structure admits a limitation before stating the benefit.", "These measures do not remove every X, but they ...")],
    },
  ),
  other(
    "toefl-integrated-005",
    "Why the Norvale Settlement Declined",
    "TOEFL",
    "Integrated Writing",
    "History",
    "Hard",
    `The reading attributes the decline of the Norvale settlement to repeated military attacks. According to the text, damaged walls and abandoned houses show that residents left after a violent conflict. The lecturer offers a different interpretation. She points out that the wall damage occurred over several decades and is consistent with seasonal floods rather than weapons. Moreover, household records show a gradual decrease in grain storage before the settlement was abandoned. This evidence supports the theory that changing rainfall made local agriculture unreliable. The lecturer also explains that valuable metal objects remained in several houses. Residents escaping an attack would probably have taken such portable goods, while a community relocating slowly might leave heavy or ceremonial items behind. Thus, the physical evidence suggests a prolonged environmental decline rather than a sudden military defeat.`,
    {
      vocabulary: [vocabulary("prolonged", "continuing for a long time", "The evidence suggests a prolonged decline.")],
      collocations: ["attributes the decline", "consistent with", "portable goods"],
      sentenceStructures: [structure("Residents escaping an attack would probably have taken such portable goods, while a community relocating slowly might leave heavy items behind.", "‘While’ contrasts the predictions of two explanations.", "A would probably ..., while B might ...")],
    },
  ),
  ...additionalToeflArticles,
  other(
    "academic-tech-001",
    "Automation and Human Judgment",
    "Academic English",
    "Technology",
    "Technology",
    "Medium",
    `Automation is most useful when it supports judgment rather than pretending to replace it. A computer system can review thousands of records and identify patterns that a person might miss. However, a pattern is not an explanation, and a prediction is not a decision. In medicine, recruitment, and public services, professionals must still ask whether the available data represent the people affected by a choice. They must also be able to explain why an automated recommendation was accepted or rejected. Effective systems therefore divide responsibility clearly: machines handle repetitive comparison, while humans remain accountable for context, values, and consequences.`,
    {
      vocabulary: [vocabulary("accountable", "responsible and required to explain decisions", "Humans remain accountable for the final decision.")],
      collocations: ["identify patterns", "represent the people", "divide responsibility"],
      sentenceStructures: [structure("A pattern is not an explanation, and a prediction is not a decision.", "Parallel clauses create a memorable distinction.", "A is not B, and C is not D.")],
    },
  ),
  other(
    "academic-econ-002",
    "Why Prices Carry Incomplete Information",
    "Academic English",
    "Economics",
    "Economics",
    "Hard",
    `Prices coordinate many individual decisions, but they do not automatically include every social cost. The price of a cheap product reflects materials, labour, transport, and profit. It may not reflect polluted water near a factory or unpaid care work in a household. Economists describe such effects as externalities because part of the cost falls outside the transaction. Policy can bring that hidden cost back into the decision through taxes, regulation, or legal responsibility. The challenge is measurement. If a government estimates the cost poorly, it may discourage a useful activity or fail to change behaviour at all. A good policy therefore combines a clear price signal with transparent evidence and regular review.`,
    {
      vocabulary: [vocabulary("externalities", "costs or benefits affecting people outside a transaction", "Pollution is a common negative externality.")],
      collocations: ["social cost", "falls outside", "price signal"],
      sentenceStructures: [structure("It may discourage a useful activity or fail to change behaviour at all.", "The ‘either outcome’ structure shows risks on both sides.", "A policy may X or fail to Y at all.")],
    },
  ),
  other(
    "academic-psych-003",
    "Memory Improves Through Retrieval",
    "Academic English",
    "Psychology",
    "Psychology",
    "Easy",
    `Students often reread notes because familiar sentences feel easy to understand. Familiarity, however, is not the same as durable memory. Retrieval practice asks learners to close the book and reconstruct an idea from memory. The effort of recalling strengthens later access to the information and reveals what has not yet been learned. A short self-test can therefore be more useful than another passive reading of the same page. Feedback remains essential: after attempting an answer, the learner should check it, correct errors, and try again after an interval.`,
    {
      vocabulary: [vocabulary("retrieval", "the process of bringing stored information back to mind", "Retrieval practice strengthens memory.")],
      collocations: ["durable memory", "passive reading", "after an interval"],
      sentenceStructures: [structure("Familiarity, however, is not the same as durable memory.", "The interrupting adverb marks a contrast with the previous sentence.", "X, however, is not the same as Y.")],
    },
  ),
  other(
    "academic-society-004",
    "Trust in Public Institutions",
    "Academic English",
    "Society",
    "Society",
    "Medium",
    `Trust in public institutions is not created by positive slogans. It grows when people can observe fair procedures, understand decisions, and challenge errors. Transparency is therefore necessary, but publishing more information is not always enough. A thousand pages of technical data may be formally open while remaining practically inaccessible. Institutions need to explain evidence in plain language, release the assumptions behind important models, and provide a clear route for appeal. They must also acknowledge uncertainty instead of presenting every policy as inevitable. Honest limits may appear to weaken authority in the short term, yet they can strengthen credibility over time because citizens learn that revision is possible when evidence changes.`,
    {
      vocabulary: [vocabulary("credibility", "the quality of being trusted or believed", "Honest limits can strengthen credibility.")],
      collocations: ["fair procedures", "plain language", "acknowledge uncertainty"],
      sentenceStructures: [structure("Honest limits may appear to weaken authority in the short term, yet they can strengthen credibility over time.", "‘May appear ..., yet ...’ contrasts appearance with a longer-term result.", "X may appear to A, yet it can B.")],
    },
  ),
  other(
    "academic-science-005",
    "A Replication Is a New Test",
    "Academic English",
    "Science",
    "Science",
    "Hard",
    `Scientific knowledge becomes reliable through repeated testing, not through the prestige of a single study. A replication repeats the main method of earlier research to see whether a similar result appears in a new sample. If the result differs, this does not automatically prove that the original researchers made a mistake. The effect may depend on age, culture, climate, measurement, or a condition that neither study considered. Replication is therefore a form of investigation rather than clerical checking. It can reveal the boundaries of a claim and encourage researchers to describe their methods more precisely.

Several kinds of replication contribute different evidence. A direct replication follows the original procedure closely, whereas a conceptual replication tests the same idea with a different method. The first asks whether a result can be reproduced under similar conditions. The second asks whether the underlying explanation survives when the surface details change. Both are useful, although disagreement is easier to interpret when researchers have documented their choices before seeing the outcome.

Journals and funding bodies sometimes prefer novel findings because they appear more exciting. That preference creates a distorted record: surprising first results receive attention, while careful attempts to verify them remain unpublished. A healthier research culture would reward teams for sharing materials, specifying their analysis before collecting data, and reporting negative results. Universities could also value replication when evaluating researchers, rather than counting novelty as the main sign of contribution. Training matters as well. Students who reproduce a published method learn that uncertainty is part of scientific work, not an embarrassment to conceal. They also discover how small procedural choices can influence a result. By treating replication as skilled research, institutions strengthen both the reliability of individual claims and the collective memory of the field. These practices do not guarantee agreement. They make disagreement more informative by showing exactly where evidence begins to diverge.`,
    {
      vocabulary: [
        vocabulary("replication", "a study that repeats an earlier method", "The replication tested the claim in a new population."),
        vocabulary("diverge", "to develop in different directions", "The two sets of evidence begin to diverge."),
      ],
      collocations: ["repeated testing", "distorted record", "negative results"],
      sentenceStructures: [structure("These practices do not guarantee agreement. They make disagreement more informative.", "The writer avoids overclaiming, then states the realistic benefit.", "X does not guarantee A. It makes B more ...")],
    },
  ),
];

export const exams: Exam[] = ["IELTS", "TOEFL", "Academic English"];
export const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"];
export const lengths = ["Short", "Medium", "Long"] as const;

export function getArticle(id?: string | null) {
  return articles.find((article) => article.id === id) ?? articles[0];
}

export function getNextArticle(currentId: string, filtered = articles) {
  const currentIndex = filtered.findIndex((article) => article.id === currentId);
  return filtered[(currentIndex + 1 + filtered.length) % filtered.length] ?? articles[0];
}
