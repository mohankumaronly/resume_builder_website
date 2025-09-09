import React, { useState, useRef, useEffect } from "react";
import { PDFDownloadLink, Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { Image as ImageIcon } from "lucide-react";

// PDF Styles
const pdfStyles = StyleSheet.create({
    page: {
        padding: 0,
        fontSize: 10,
        fontFamily: "Helvetica",
        flexDirection: 'column',
    },
    header: {
        backgroundColor: '#374151',
        color: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 40,
        borderBottomRightRadius: 50,
    },
    headerText: {
        marginLeft: 20,
        flexGrow: 1,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 12,
        color: '#D1D5DB',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        objectFit: 'cover',
        borderWidth: 2,
        borderColor: '#4B5563',
    },
    mainContent: {
        flexDirection: 'row',
        flexGrow: 1,
    },
    leftColumn: {
        width: '35%',
        backgroundColor: '#F3F4F6',
        padding: 20,
        paddingTop: 40,
    },
    rightColumn: {
        width: '65%',
        padding: 20,
        paddingTop: 40,
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: 8,
    },
    contactInfo: {
        fontSize: 10,
        color: '#374151',
        marginBottom: 5,
    },
    contactItem: {
        marginBottom: 5,
    },
    bulletList: {
        marginBottom: 5,
    },
    bulletItem: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    bullet: {
        marginRight: 5,
    },
    text: {
        fontSize: 10,
        lineHeight: 1.4,
    },
    objectiveText: {
        fontStyle: 'italic',
        color: '#4B5563',
    },
    subSection: {
        marginBottom: 10,
    },
    subSectionTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: 2,
    },
    subSectionDate: {
        fontSize: 9,
        color: '#6B7280',
        marginBottom: 2,
    },
    subSectionDetail: {
        fontSize: 9,
        color: '#6B7280',
        marginBottom: 5,
    },
});

// Helper component for bullet lists
const BulletList = ({ items }) => (
    <View style={pdfStyles.bulletList}>
        {items.map((item, index) => (
            <View key={index} style={pdfStyles.bulletItem}>
                <Text style={pdfStyles.bullet}>•</Text>
                <Text style={pdfStyles.text}>{item}</Text>
            </View>
        ))}
    </View>
);

export default function ResumeBuilderApp() {
    const [formData, setFormData] = useState({
        name: "Mohan Kumar",
        subtitle: "Full Stack Developer (MERN and Flutter)",
        image: null,
        phone: "+91 1234567891",
        email: "mohankumaronly81@@mail.com",
        address: "Karnataka, India",
        links: [
            { name: "Portfolio", url: "www.behance.net/mohan" },
            { name: "Website", url: "www.mohan.com" },
            { name: "LinkedIn", url: "www.linkedin.com/in/mohan" },
        ],
        careerObjective: "Enthusiastic and adaptable software developer with a strong foundation in MERN stack (MongoDB, Express.js, React.js, Node.js), Flutter, and C++ programming. Skilled in designing and building responsive web and mobile applications, with a focus on clean code, performance, and user experience.Hands- on experience in using GitHub and GitHub Actions for version control and automation, ensuring smooth collaboration and continuous integration.Proficient in Postman for API testing and debugging, and familiar with Figma for creating and improving user interface designs.Recognized for strong problem - solving abilities, logical thinking, and teamwork skills, with the ability to learn and adapt quickly in fast - paced environments.Passionate about building scalable, efficient, and impactful software solutions.Currently seeking an entry - level software developer role where I can apply technical expertise, contribute to innovative projects, and continue to grow as a developer while adding value to the organization.",
        education: [
            { degree: "Bachelor of Technology in Computer Science", institution: "Sunshine Engineering College, Mumbai, Maharashtra", date: "May 2022" },
            { degree: "Higher Secondary Education (12th Grade)", institution: "Golden Valley Senior Secondary School, Pune, Maharashtra", date: "May 2018" },
            { degree: "Secondary Education (10th Grade)", institution: "Bright Horizon Middle School, Pune, Maharashtra", date: "May 2016" },
        ],
        technicalSkills: [
            "Computer Skills",
            "Internet Browsing",
            "Email Communication",
            "File Management",
        ],
        projects: [
            { title: "Portfolio Website Design", description: "Designed and developed a personal portfolio website to showcase my graphic design work. Utilized HTML, CSS, and JavaScript for a responsive and visually appealing user experience." },
            { title: "Brand Identity for a Startup", description: "Created a complete brand identity for a new tech startup, including a logo, color palette, typography, and style guide. The design helped establish a consistent and professional brand image." }
        ],
        languages: ["Hindi", "English", "French"],
    });

    const textareaRefs = useRef({});

    useEffect(() => {
        // Resize all textareas on initial load
        Object.values(textareaRefs.current).forEach(ref => {
            if (ref) {
                ref.style.height = "auto";
                ref.style.height = ref.scrollHeight + "px";
            }
        });
    }, [formData]);

    const handleTextareaChange = (e, fieldName) => {
        const { value } = e.target;

        // Update state
        setFormData(prev => ({ ...prev, [fieldName]: value }));

        // Resize textarea
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
    };

    const handleListChange = (e, field) => {
        const { value } = e.target;
        setFormData({ ...formData, [field]: value.split('\n').map(item => item.trim()) });
        handleTextareaChange(e, field);
    };

    const handleLinksChange = (e) => {
        const { value } = e.target;
        const newLinks = value.split('\n').map(line => {
            const parts = line.split(',');
            return { name: parts[0]?.trim(), url: parts[1]?.trim() };
        });
        setFormData({ ...formData, links: newLinks });
        handleTextareaChange(e, 'links');
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setFormData({ ...formData, image: reader.result });
            reader.readAsDataURL(file);
        }
    };

    // PDF Document
    const MyDocument = (
        <Document>
            <Page size="A4" style={pdfStyles.page}>
                {/* Header Section */}
                <View style={pdfStyles.header}>
                    {formData.image && <Image style={pdfStyles.profileImage} src={formData.image} />}
                    <View style={pdfStyles.headerText}>
                        <Text style={pdfStyles.name}>{formData.name}</Text>
                        <Text style={pdfStyles.title}>{formData.subtitle}</Text>
                    </View>
                </View>

                {/* Main Content: Two Columns */}
                <View style={pdfStyles.mainContent}>
                    {/* Left Column (Contact, Skills, etc.) */}
                    <View style={pdfStyles.leftColumn}>
                        {/* Contact */}
                        <View style={pdfStyles.section}>
                            <Text style={pdfStyles.sectionTitle}>Contact</Text>
                            <View style={pdfStyles.contactInfo}>
                                {formData.phone && <View style={pdfStyles.contactItem}><Text>{formData.phone}</Text></View>}
                                {formData.email && <View style={pdfStyles.contactItem}><Text>{formData.email}</Text></View>}
                                {formData.address && <View style={pdfStyles.contactItem}><Text>{formData.address}</Text></View>}
                            </View>
                        </View>

                        {/* Links */}
                        {formData.links.length > 0 && (
                            <View style={pdfStyles.section}>
                                <Text style={pdfStyles.sectionTitle}>Links</Text>
                                {formData.links.map((link, index) => (
                                    <View key={index} style={pdfStyles.bulletItem}>
                                        <Text style={pdfStyles.bullet}>•</Text>
                                        <Text style={pdfStyles.text}>{link.name}: {link.url}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Languages */}
                        {formData.languages.length > 0 && (
                            <View style={pdfStyles.section}>
                                <Text style={pdfStyles.sectionTitle}>Language</Text>
                                <BulletList items={formData.languages} />
                            </View>
                        )}

                        {/* Technical Skills */}
                        {formData.technicalSkills.length > 0 && (
                            <View style={pdfStyles.section}>
                                <Text style={pdfStyles.sectionTitle}>Technical Skills</Text>
                                <BulletList items={formData.technicalSkills} />
                            </View>
                        )}
                    </View>

                    {/* Right Column (Objective, Education, Projects, etc.) */}
                    <View style={pdfStyles.rightColumn}>
                        {/* Career Objective */}
                        {formData.careerObjective && (
                            <View style={pdfStyles.section}>
                                <Text style={pdfStyles.sectionTitle}>Career Objective</Text>
                                <Text style={pdfStyles.objectiveText}>{formData.careerObjective}</Text>
                            </View>
                        )}

                        {/* Education */}
                        {formData.education.length > 0 && (
                            <View style={pdfStyles.section}>
                                <Text style={pdfStyles.sectionTitle}>Education</Text>
                                {formData.education.map((edu, index) => (
                                    <View key={index} style={pdfStyles.subSection}>
                                        <Text style={pdfStyles.subSectionTitle}>{edu.degree}</Text>
                                        <Text style={pdfStyles.subSectionDetail}>{edu.institution}</Text>
                                        <Text style={pdfStyles.subSectionDate}>{edu.date}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Projects */}
                        {formData.projects.length > 0 && (
                            <View style={pdfStyles.section}>
                                <Text style={pdfStyles.sectionTitle}>Projects</Text>
                                {formData.projects.map((proj, index) => (
                                    <View key={index} style={pdfStyles.subSection}>
                                        <Text style={pdfStyles.subSectionTitle}>{proj.title}</Text>
                                        <Text style={pdfStyles.text}>{proj.description}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </View>
            </Page>
        </Document>
    );

    // Preview Section
    const SectionPreview = ({ title, children }) => (
        <div className="mb-4">
            <h3 className="font-bold text-lg mb-2 border-b-2 border-gray-400 pb-1">{title}</h3>
            {children}
        </div>
    );

    return (
        <div className="min-h-screen p-6 bg-gray-100 font-sans flex flex-col gap-6">
            {/* Website Info Preview */}
            <div className="bg-white p-4 rounded shadow text-center text-sm text-gray-700">
                This website is build by mohan the website domain or the server may close any time ok
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Form */}
                <div className="bg-white p-6 rounded-2xl shadow-lg overflow-y-auto h-[85vh] flex flex-col gap-3">
                    <input name="name" placeholder="Full Name" value={formData.name} onChange={e => handleChange(e)} className="border p-2 rounded w-full" />
                    <input name="subtitle" placeholder="Subtitle (e.g., Graphic Designer)" value={formData.subtitle} onChange={e => handleChange(e)} className="border p-2 rounded w-full" />
                    <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={e => handleChange(e)} className="border p-2 rounded w-full" />
                    <input name="email" placeholder="Email" value={formData.email} onChange={e => handleChange(e)} className="border p-2 rounded w-full" />
                    <input name="address" placeholder="Address" value={formData.address} onChange={e => handleChange(e)} className="border p-2 rounded w-full" />

                    <div className="border p-2 rounded flex flex-col items-center">
                        <label className="flex items-center gap-2 mb-2">
                            <ImageIcon size={18} /> Upload Profile Image
                        </label>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full" />
                        {formData.image && <img src={formData.image} alt="Profile" className="mt-2 w-32 h-32 object-cover rounded-full" />}
                    </div>

                    <textarea
                        ref={el => textareaRefs.current['links'] = el}
                        name="links"
                        placeholder="Links (one per line, e.g., 'Portfolio, www.link.com')"
                        value={formData.links.map(l => `${l.name}, ${l.url}`).join('\n')}
                        onChange={handleLinksChange}
                        className="border p-2 rounded w-full min-h-[6rem] resize-none overflow-hidden"
                    />

                    <textarea
                        ref={el => textareaRefs.current['careerObjective'] = el}
                        name="careerObjective"
                        placeholder="Career Objective (more detailed description)"
                        value={formData.careerObjective}
                        onChange={e => handleTextareaChange(e, 'careerObjective')}
                        className="border p-2 rounded w-full min-h-[6rem] resize-none overflow-hidden"
                    />

                    <textarea
                        ref={el => textareaRefs.current['education'] = el}
                        name="education"
                        placeholder="Education (one per line, e.g., 'Degree, Institution, Date')"
                        value={formData.education.map(e => `${e.degree}, ${e.institution}, ${e.date}`).join('\n')}
                        onChange={(e) => {
                            const newEducation = e.target.value.split('\n').map(line => {
                                const parts = line.split(',');
                                return { degree: parts[0]?.trim(), institution: parts[1]?.trim(), date: parts[2]?.trim() };
                            });
                            setFormData({ ...formData, education: newEducation });
                            handleTextareaChange(e, 'education');
                        }}
                        className="border p-2 rounded w-full min-h-[6rem] resize-none overflow-hidden"
                    />

                    <textarea
                        ref={el => textareaRefs.current['projects'] = el}
                        name="projects"
                        placeholder="Projects (one per line, e.g., 'Title, Description')"
                        value={formData.projects.map(p => `${p.title}, ${p.description}`).join('\n')}
                        onChange={(e) => {
                            const newProjects = e.target.value.split('\n').map(line => {
                                const parts = line.split(',');
                                return { title: parts[0]?.trim(), description: parts[1]?.trim() };
                            });
                            setFormData({ ...formData, projects: newProjects });
                            handleTextareaChange(e, 'projects');
                        }}
                        className="border p-2 rounded w-full min-h-[6rem] resize-none overflow-hidden"
                    />

                    <textarea
                        ref={el => textareaRefs.current['technicalSkills'] = el}
                        name="technicalSkills"
                        placeholder="Technical Skills (one per line)"
                        value={formData.technicalSkills.join('\n')}
                        onChange={(e) => handleListChange(e, 'technicalSkills')}
                        className="border p-2 rounded w-full min-h-[6rem] resize-none overflow-hidden"
                    />

                    <textarea
                        ref={el => textareaRefs.current['languages'] = el}
                        name="languages"
                        placeholder="Languages (one per line)"
                        value={formData.languages.join('\n')}
                        onChange={(e) => handleListChange(e, 'languages')}
                        className="border p-2 rounded w-full min-h-[6rem] resize-none overflow-hidden"
                    />
                </div>

                {/* Preview */}
                <div className="bg-white p-6 rounded-2xl shadow-lg overflow-y-auto h-[85vh] flex flex-col gap-4">
                    {/* Header Preview */}
                    <div className="flex items-center p-4 bg-gray-800 text-white rounded-t-xl">
                        {formData.image && <img src={formData.image} alt="Profile" className="w-24 h-24 rounded-full object-cover" />}
                        <div className="ml-4">
                            <h1 className="text-3xl font-bold">{formData.name}</h1>
                            <p className="text-sm text-gray-400">{formData.subtitle}</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Left Column Preview */}
                        <div className="md:w-1/3 p-4 bg-gray-100 rounded-b-xl">
                            <SectionPreview title="Contact">
                                {formData.phone && <p className="text-sm mb-1">{formData.phone}</p>}
                                {formData.email && <p className="text-sm mb-1">{formData.email}</p>}
                                {formData.address && <p className="text-sm">{formData.address}</p>}
                            </SectionPreview>

                            {formData.links.length > 0 && (
                                <SectionPreview title="Links">
                                    <ul className="list-disc list-inside text-sm">
                                        {formData.links.map((link, index) => <li key={index}>{link.name}: {link.url}</li>)}
                                    </ul>
                                </SectionPreview>
                            )}

                            {formData.technicalSkills.length > 0 && (
                                <SectionPreview title="Technical Skills">
                                    <ul className="list-disc list-inside text-sm">
                                        {formData.technicalSkills.map((skill, index) => <li key={index}>{skill}</li>)}
                                    </ul>
                                </SectionPreview>
                            )}

                            {formData.languages.length > 0 && (
                                <SectionPreview title="Language">
                                    <ul className="list-disc list-inside text-sm">
                                        {formData.languages.map((lang, index) => <li key={index}>{lang}</li>)}
                                    </ul>
                                </SectionPreview>
                            )}
                        </div>

                        {/* Right Column Preview */}
                        <div className="md:w-2/3 p-4">
                            {formData.careerObjective && (
                                <SectionPreview title="Career Objective">
                                    <p className="italic text-sm text-gray-700">{formData.careerObjective}</p>
                                </SectionPreview>
                            )}

                            {formData.education.length > 0 && (
                                <SectionPreview title="Education">
                                    {formData.education.map((edu, index) => (
                                        <div key={index} className="mb-2">
                                            <p className="font-bold text-sm">{edu.degree}</p>
                                            <p className="text-xs text-gray-600">{edu.institution}</p>
                                            <p className="text-xs text-gray-500">{edu.date}</p>
                                        </div>
                                    ))}
                                </SectionPreview>
                            )}

                            {formData.projects.length > 0 && (
                                <SectionPreview title="Projects">
                                    {formData.projects.map((proj, index) => (
                                        <div key={index} className="mb-2">
                                            <p className="font-bold text-sm">{proj.title}</p>
                                            <p className="text-sm text-gray-700">{proj.description}</p>
                                        </div>
                                    ))}
                                </SectionPreview>
                            )}
                        </div>
                    </div>

                    {/* PDF Download */}
                    <PDFDownloadLink
                        document={MyDocument}
                        fileName="resume.pdf"
                        style={{ marginTop: 10, backgroundColor: "#2563eb", color: "white", padding: "8px 16px", borderRadius: 8, textAlign: "center" }}
                    >
                        {({ loading }) => (loading ? "Preparing PDF..." : "Download PDF")}
                    </PDFDownloadLink>
                </div>
            </div>
        </div>
    );
}