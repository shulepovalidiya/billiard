import React, {useEffect, useRef, useState} from "react";
import {Modal} from "../modal/Modal";

interface Ball {
    x: number;
    y: number;
    radius: number;
    color: string;
    dx: number;
    dy: number;
}

const Game: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedBallIndex, setSelectedBallIndex] = useState(-1);

    const [balls, setBalls] = useState([
        { x: 100, y: 200, radius: 20, color: "red", dx: 0, dy: 0 },
        { x: 300, y: 100, radius: 30, color: "blue", dx: 0, dy: 0 },
        { x: 500, y: 300, radius: 25, color: "green", dx: 0, dy: 0 },
        { x: 200, y: 200, radius: 15, color: "green", dx: 0, dy: 0 }
    ]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        const drawBalls = () => {
            const animate = () => {
                if (!ctx) return;

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                balls.forEach((ball: Ball) => {
                    ball.x += ball.dx;
                    ball.y += ball.dy;

                    // Отскок шаров от границ холста
                    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
                        ball.dx *= -0.8;
                    }
                    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
                        ball.dy *= -0.8;
                    }

                    // Обработка столкновений между шарами
                    balls.forEach((otherBall: Ball) => {
                        if (ball !== otherBall) {
                            const dx = otherBall.x - ball.x;
                            const dy = otherBall.y - ball.y;
                            const distance = Math.sqrt(dx ** 2 + dy ** 2);

                            if (distance < ball.radius + otherBall.radius) {
                                // Расчет новых скоростей после столкновения
                                const angle = Math.atan2(dy, dx);
                                const vx1 = ball.dx;
                                const vy1 = ball.dy;
                                const vx2 = otherBall.dx;
                                const vy2 = otherBall.dy;

                                const newX1 = ((ball.radius - otherBall.radius) * vx1 + (2 * otherBall.radius) * vx2) / (ball.radius + otherBall.radius);
                                const newY1 = ((ball.radius - otherBall.radius) * vy1 + (2 * otherBall.radius) * vy2) / (ball.radius + otherBall.radius);
                                const newX2 = ((otherBall.radius - ball.radius) * vx2 + (2 * ball.radius) * vx1) / (ball.radius + otherBall.radius);
                                const newY2 = ((otherBall.radius - ball.radius) * vy2 + (2 * ball.radius) * vy1) / (ball.radius + otherBall.radius);

                                ball.dx = newX1;
                                ball.dy = newY1;
                                otherBall.dx = newX2;
                                otherBall.dy = newY2;
                            }
                        }
                    });

                    // Отрисовка шаров
                    ctx.beginPath();
                    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
                    ctx.fillStyle = ball.color;
                    ctx.fill();
                    ctx.closePath();
                });

                requestAnimationFrame(animate);
            };

            animate();
        };

        drawBalls();

        const handleClick = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            balls.forEach((ball: Ball, index: number) => {
                if (Math.sqrt((mouseX - ball.x) ** 2 + (mouseY - ball.y) ** 2) <= ball.radius) {
                    setSelectedBallIndex(index);
                    setShowModal(true);
                }
            });
        };

        const handleMouseMove = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            // Проверяем, попал ли курсор в шар
            for (let i = 0; i < balls.length; i++) {
                const ball = balls[i];
                if (Math.sqrt((mouseX - ball.x) ** 2 + (mouseY - ball.y) ** 2) <= ball.radius) {
                    // Толкаем шар в сторону движения мыши
                    const dx = mouseX - ball.x;
                    const dy = mouseY - ball.y;
                    ball.dx += dx * 0.05;
                    ball.dy += dy * 0.05;
                    break;
                }
            }
        }

        canvas.addEventListener("click", handleClick);
        canvas.addEventListener("mousemove", handleMouseMove)

        return () => {
            canvas.removeEventListener("click", handleClick);
            canvas.removeEventListener("mousemove", handleMouseMove)
        };
    }, [balls]);

    const changeBallColor = (ballIndex: number, color: string) => {
        if (color) {
            let newBalls = balls
            newBalls[ballIndex].color = color;
            setBalls(newBalls)
        }
    }

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedBallIndex(-1);
    };

    return (
        <div>
            {showModal && (
                <Modal ballIndex={selectedBallIndex} onClose={handleModalClose} onSave={changeBallColor} />
            )}
            <canvas ref={canvasRef} width={800} height={400} style={{border: "1px solid black"}}/>
        </div>
    );
};

export default Game;