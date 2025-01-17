import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Slider, Divider } from "@mui/material";
import { ButtonCustom } from "./mui_custom";
import ToggleButtonCustom from "./mui_custom/ToggleButtonCustom.tsx";

interface QuestionType {
    title: string;
    type: "slider" | "multiselect" | "single";
    options?: string[];
    content?: (props: { value: number; onChange: (value: number) => void }) => JSX.Element;
}

interface AnswersType {
    groupSize: number;
    interests: string[];
    duration: string;
    accessibility: string;
    experiences: string[];
}

const questions: QuestionType[] = [
    {
        title: "Quelle est la taille de votre groupe ?",
        type: "slider",
        content: ({ value, onChange }) => (
            <Slider
                value={value}
                onChange={(_, newValue) => onChange(newValue as number)}
                step={1}
                marks
                min={1}
                max={20}
                valueLabelDisplay="on"
                sx={{ width: "80%", margin: "0 auto" }}
            />
        ),
    },
    {
        title: "Quels types de thèmes ou centres d'intérêt vous attirent le plus ?",
        type: "multiselect",
        options: ["🏺 Archéologie", "🏛️ Architecture", "🛡️ Médiéval", "🌳 Nature", "⛪ Religion", "🏰 Villages", "🌱 Jardins"],
    },
    {
        title: "Combien de temps souhaitez-vous consacrer à votre visite ?",
        type: "single",
        options: ["< 2h", "2-3h", "> 3h"],
    },
    {
        title: "Avez-vous besoin d'un site accessible aux personnes à mobilité réduite (PMR) ?",
        type: "single",
        options: ["✅ Oui", "🚫 Non"],
    },
    {
        title: "Souhaitez-vous une expérience spécifique parmi ces options ?",
        type: "multiselect",
        options: ["🚶 Balade", "🎨 Découverte", "📚 Visite guidée", "🏰 Exploration", "🏘️ Immersion"],
    },
];

const Questionnaire: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isClosing, setIsClosing] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number | undefined>(undefined);

    const [answers, setAnswers] = useState<AnswersType>({
        groupSize: 1,
        interests: [],
        duration: "",
        accessibility: "",
        experiences: [],
    });

    useEffect(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => {
        if (contentRef.current) {
            setHeight(contentRef.current.offsetHeight);
        }
    }, [currentQuestion]);

    const isQuestionAnswered = () => {
        switch (currentQuestion) {
            case 0:
                return true; // Slider always has a value
            case 1:
                return answers.interests.length > 0;
            case 2:
                return answers.duration !== "";
            case 3:
                return answers.accessibility !== "";
            case 4:
                return answers.experiences.length > 0;
            default:
                return false;
        }
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentQuestion((prev) => prev + 1);
                setIsAnimating(false);
            }, 300);
        } else {
            console.log("Final answers:", answers);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentQuestion((prev) => prev - 1);
                setIsAnimating(false);
            }, 300);
        } else {
            triggerClose();
        }
    };

    const handleSelection = (option: string) => {
        switch (currentQuestion) {
            case 1: // Interests (multiselect)
                setAnswers(prev => ({
                    ...prev,
                    interests: prev.interests.includes(option)
                        ? prev.interests.filter(item => item !== option)
                        : [...prev.interests, option]
                }));
                break;
            case 2: // Duration (single)
                setAnswers(prev => ({
                    ...prev,
                    duration: option
                }));
                break;
            case 3: // Accessibility (single)
                setAnswers(prev => ({
                    ...prev,
                    accessibility: option
                }));
                break;
            case 4: // Experiences (multiselect)
                setAnswers(prev => ({
                    ...prev,
                    experiences: prev.experiences.includes(option)
                        ? prev.experiences.filter(item => item !== option)
                        : [...prev.experiences, option]
                }));
                break;
        }
    };

    const renderQuestionContent = () => {
        const question = questions[currentQuestion];

        if (currentQuestion === 0 && question.content) {
            return question.content({
                value: answers.groupSize,
                onChange: (value: number) => setAnswers(prev => ({ ...prev, groupSize: value }))
            });
        }

        if (!question.options) {
            return null;
        }

        return (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center" }}>
                {question.options.map((option, index) => (
                    <ToggleButtonCustom
                        key={index}
                        variant="outlined"
                        size="large"
                        className={
                            question.type === "single"
                                ? (currentQuestion === 2 && answers.duration === option) ||
                                (currentQuestion === 3 && answers.accessibility === option)
                                    ? "selected"
                                    : ""
                                : (currentQuestion === 1 && answers.interests.includes(option)) ||
                                (currentQuestion === 4 && answers.experiences.includes(option))
                                    ? "selected"
                                    : ""
                        }
                        onClick={() => handleSelection(option)}
                    >
                        {option}
                    </ToggleButtonCustom>
                ))}
            </Box>
        );
    };

    const triggerClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 200);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                triggerClose();
            }
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                triggerClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 10000,
                opacity: isVisible && !isClosing ? 1 : 0,
                transition: "opacity 0.2s ease-in-out",
            }}
        >
            <Box
                ref={panelRef}
                sx={{
                    width: "100%",
                    maxWidth: 600,
                    padding: "2em",
                    backgroundColor: "white",
                    borderRadius: "1em",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.35)",
                    transform: isVisible && !isClosing ? "scale(1)" : "scale(0.9)",
                    transition: "transform 0.2s ease-in-out, opacity 0.2s ease-in-out",
                    height: height ? `auto` : "auto",
                    overflow: "hidden",
                }}
            >
                <Typography variant="h4" fontWeight="bold" textAlign="center">
                    Questionnaire personnalisé
                </Typography>
                <Typography variant="subtitle2" textAlign="center" fontSize="1em" mb="1em">
                    Besoin d'aide pour trouver le site qui vous correspond le mieux ?
                </Typography>

                <Divider
                    sx={{
                        margin: "1em 0 1.5em",
                        borderRadius: "1em",
                        height: "0.15em",
                        backgroundColor: "lightgray",
                        border: "none"
                    }}
                />

                <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 2 }}>
                    {questions.map((_, index) => (
                        <Box
                            key={index}
                            sx={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                backgroundColor: index <= currentQuestion ? "primary.main" : "gray",
                            }}
                        />
                    ))}
                </Box>

                <Box
                    ref={contentRef}
                    sx={{
                        opacity: isAnimating ? 0 : 1,
                        transition: "opacity 0.3s ease-in-out",
                    }}
                >
                    <Typography variant="h5" mb="1em" textAlign="center" gutterBottom>
                        {questions[currentQuestion].title}
                    </Typography>
                    <Box
                        sx={{
                            marginBottom: 4,
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {renderQuestionContent()}
                    </Box>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <ButtonCustom
                        variant="outlined"
                        color="error"
                        onClick={handlePrevious}
                        size="large"
                    >
                        {currentQuestion === 0 ? "❌ Fermer" : "← Question précédente"}
                    </ButtonCustom>
                    <ButtonCustom
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        disabled={!isQuestionAnswered()}
                        size="large"
                    >
                        {currentQuestion === questions.length - 1 ? "Envoyer ✅" : "Question suivante →"}
                    </ButtonCustom>
                </Box>
            </Box>
        </Box>
    );
};

export default Questionnaire;