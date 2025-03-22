import React from 'react';
import { FaGithub, FaLaptopCode, FaDatabase, FaLink, FaPlay } from 'react-icons/fa';
import styles from './Footer.module.scss';

const Footer = () => {
    // 프로젝트 링크
    const projectLinks = {
        frontend: "https://github.com/joayong202503/joayong_front",
        backend: "https://github.com/joayong202503/joayong_back",
    };

    // Team members data
    const teamMembers = [
        [
            { name: "김성윤", github: "https://github.com/cafephilia", role: "풀스택" },
            { name: "김미정", github: "https://github.com/mjkim41", role: "프론트" },
            { name: "오세영", github: "https://github.com/seyoung0314", role: "풀스택" },
        ],
        [
            { name: "유안준", github: "https://github.com/anjun0413", role: "프론트" },
            { name: "장유진", github: "https://github.com/chchch928", role: "프론트" }
        ]
    ];

    return (
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>
                {/* Project Links Section */}
                <div className={`${styles.footerSection} ${styles.sectionProjects}`}>
                    <h3 className={styles.footerTitle}>프로젝트</h3>
                    <div className={styles.projectGrid}>
                        <a href={projectLinks.frontend} className={styles.projectLink} target="_blank" rel="noopener noreferrer">
                            <FaLaptopCode className={styles.projectIcon} />
                            <span>프론트엔드</span>
                        </a>
                        <a href={projectLinks.backend} className={styles.projectLink} target="_blank" rel="noopener noreferrer">
                            <FaDatabase className={styles.projectIcon} />
                            <span>백엔드</span>
                        </a>
                    </div>
                </div>

                {/* Team Members Section */}
                <div className={`${styles.footerSection} ${styles.sectionTeam}`}>
                    <span className={styles.footerTitle}>팀원</span>
                    <span className={styles.footerTitleSub}>(팀장: 김성윤)</span>
                    <div className={styles.teamRow}>
                        {teamMembers[0].map((member, index) => (
                            <div key={index} className={styles.memberCard}>
                                <a
                                    href={member.github}
                                    className={styles.memberLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <FaGithub className={styles.memberIcon} />
                                    <span className={styles.memberName}>{member.name}</span>
                                </a>
                                <span className={styles.memberRole}>{member.role}</span>
                            </div>
                        ))}
                        {teamMembers[1].map((member, index) => (
                            <div key={index} className={styles.memberCard}>
                                <a
                                    href={member.github}
                                    className={styles.memberLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <FaGithub className={styles.memberIcon} />
                                    <span className={styles.memberName}>{member.name}</span>
                                </a>
                                <span className={styles.memberRole}>{member.role}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Copyright Section */}
            <div className={styles.copyright}>
                © {new Date().getFullYear()} 재능 교환 플랫폼 프로젝트
            </div>
        </footer>
    );
};

export default Footer;