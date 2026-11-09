import { Problem } from '../types';

export const mathEngine = {
  rInt: (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  fmt: (n: number): string => {
    return n >= 0 ? `(+${n})` : `(${n})`;
  },

  generate: (
    lvl: number,
    idx: number,
    adaptiveMode: 'easy' | 'normal' | 'hard'
  ): Problem => {
    let display = '';
    let answer = 0;
    let explanation = '';
    const { rInt, fmt } = mathEngine;

    // Define adaptive modifiers based on difficulty level
    // easy: reduce numerical range to half, and avoid negative numbers
    // hard: expand numerical range by 50%
    // normal: original rules
    let rangeMultiplier = 1.0;
    let allowNegatives = true;

    if (adaptiveMode === 'easy') {
      rangeMultiplier = 0.5;
      allowNegatives = false;
    } else if (adaptiveMode === 'hard') {
      rangeMultiplier = 1.5;
    }

    // Helper to get adjusted random int
    const getAdjustedInt = (min: number, max: number): number => {
      let adjMin = Math.round(min * rangeMultiplier);
      let adjMax = Math.round(max * rangeMultiplier);

      if (!allowNegatives) {
        adjMin = Math.max(0, adjMin);
        adjMax = Math.max(1, adjMax);
      }

      // Avoid returning 0 if we need a non-zero divisor
      let val = rInt(adjMin, adjMax);
      return val;
    };

    if (lvl === 1) {
      // Sums & Subtractions
      let a = getAdjustedInt(-20, 20);
      let b = getAdjustedInt(-20, 20);
      
      if (idx >= 10) {
        let c = getAdjustedInt(-10, 10);
        let d = getAdjustedInt(-10, 10);
        answer = a + b - c + d;
        display = `${fmt(a)} + ${fmt(b)} - ${fmt(c)} + ${fmt(d)}`;
        explanation = "Agrupa positivos por un lado, negativos por el otro, y calcula la diferencia final.";
      } else if (idx >= 5) {
        answer = a - b;
        display = `${fmt(a)} - ${fmt(b)}`;
        explanation = `Para restar, sumamos al primer número el opuesto del segundo: ${fmt(a)} + ${fmt(-b)} = ${answer}.`;
      } else {
        answer = a + b;
        display = `${fmt(a)} + ${fmt(b)}`;
        explanation = "Recuerda: Signos iguales se suman y mantienen el signo. Signos diferentes se restan y prevalece el signo del mayor en valor absoluto.";
      }
    } else if (lvl === 2) {
      // Multiplication & Division
      if (idx >= 10) {
        // Combined multiplications and divisions: alternate between parenthesis first and parenthesis second
        let a = 2, b = 3, c = 2;
        let intermediate = 6;
        let ans = 3;
        let formulaStr = `[${fmt(a)} · ${fmt(b)}] : ${fmt(c)}`;
        let explStr = `Primero resolvemos el corchete de izquierda a derecha: [${fmt(a)} · ${fmt(b)}] = ${fmt(intermediate)}. Luego dividimos por ${fmt(c)}: ${fmt(intermediate)} : ${fmt(c)} = ${ans}.`;
        let attempts = 0;

        if (idx % 2 === 0) {
          // Pattern 1: Parenthesis First
          while (attempts < 1000) {
            const subOption = rInt(1, 2);
            if (subOption === 1) {
              // [a · b] : c
              const testA = getAdjustedInt(-10, 10);
              const testB = getAdjustedInt(-10, 10);
              const testC = getAdjustedInt(-10, 10);
              if (testA !== 0 && testB !== 0 && testC !== 0) {
                const testInter = testA * testB;
                if (Math.abs(testInter) <= 99 && testInter % testC === 0) {
                  const testAns = testInter / testC;
                  if (Math.abs(testAns) <= 99) {
                    a = testA;
                    b = testB;
                    c = testC;
                    intermediate = testInter;
                    ans = testAns;
                    formulaStr = `[${fmt(a)} · ${fmt(b)}] : ${fmt(c)}`;
                    explStr = `Primero resolvemos el corchete de izquierda a derecha: [${fmt(a)} · ${fmt(b)}] = ${fmt(intermediate)}. Luego dividimos por ${fmt(c)}: ${fmt(intermediate)} : ${fmt(c)} = ${ans}.`;
                    break;
                  }
                }
              }
            } else {
              // [a : b] · c
              const testB = getAdjustedInt(-10, 10);
              if (testB !== 0) {
                const temp = getAdjustedInt(-10, 10);
                if (temp !== 0) {
                  const testA = temp * testB;
                  const testC = getAdjustedInt(-10, 10);
                  if (testC !== 0) {
                    const testInter = temp;
                    const testAns = testInter * testC;
                    if (Math.abs(testA) <= 99 && Math.abs(testInter) <= 99 && Math.abs(testAns) <= 99) {
                      a = testA;
                      b = testB;
                      c = testC;
                      intermediate = testInter;
                      ans = testAns;
                      formulaStr = `[${fmt(a)} : ${fmt(b)}] · ${fmt(c)}`;
                      explStr = `Primero resolvemos el corchete de izquierda a derecha: [${fmt(a)} : ${fmt(b)}] = ${fmt(intermediate)}. Luego multiplicamos por ${fmt(c)}: ${fmt(intermediate)} · ${fmt(c)} = ${ans}.`;
                      break;
                    }
                  }
                }
              }
            }
            attempts++;
          }
        } else {
          // Pattern 2: Parenthesis Second
          // Default: a = 3, b = 6, c = 2 -> 3 · [6 : 2] = 9
          a = 3; b = 6; c = 2;
          intermediate = 3;
          ans = 9;
          formulaStr = `${fmt(a)} · [${fmt(b)} : ${fmt(c)}]`;
          explStr = `Primero resolvemos el corchete: [${fmt(b)} : ${fmt(c)}] = ${fmt(intermediate)}. Luego multiplicamos por ${fmt(a)}: ${fmt(a)} · ${fmt(intermediate)} = ${ans}.`;

          while (attempts < 1000) {
            const subOption = rInt(1, 2);
            if (subOption === 1) {
              // a · [b : c]
              const testC = getAdjustedInt(-10, 10);
              if (testC !== 0) {
                const temp = getAdjustedInt(-10, 10);
                if (temp !== 0) {
                  const testB = temp * testC;
                  const testA = getAdjustedInt(-10, 10);
                  if (testA !== 0) {
                    const testInter = temp;
                    const testAns = testA * testInter;
                    if (Math.abs(testB) <= 99 && Math.abs(testInter) <= 99 && Math.abs(testAns) <= 99) {
                      a = testA;
                      b = testB;
                      c = testC;
                      intermediate = testInter;
                      ans = testAns;
                      formulaStr = `${fmt(a)} · [${fmt(b)} : ${fmt(c)}]`;
                      explStr = `Primero resolvemos el corchete: [${fmt(b)} : ${fmt(c)}] = ${fmt(intermediate)}. Luego multiplicamos por ${fmt(a)}: ${fmt(a)} · ${fmt(intermediate)} = ${ans}.`;
                      break;
                    }
                  }
                }
              }
            } else {
              // a : [b · c]
              const testB = getAdjustedInt(-10, 10);
              const testC = getAdjustedInt(-10, 10);
              if (testB !== 0 && testC !== 0) {
                const testInter = testB * testC;
                const temp = getAdjustedInt(-10, 10);
                if (temp !== 0) {
                  const testA = temp * testInter;
                  const testAns = temp;
                  if (Math.abs(testA) <= 99 && Math.abs(testInter) <= 99 && Math.abs(testAns) <= 99) {
                    a = testA;
                    b = testB;
                    c = testC;
                    intermediate = testInter;
                    ans = temp;
                    formulaStr = `${fmt(a)} : [${fmt(b)} · ${fmt(c)}]`;
                    explStr = `Primero resolvemos el corchete: [${fmt(b)} · ${fmt(c)}] = ${fmt(intermediate)}. Luego dividimos ${fmt(a)} por ${fmt(intermediate)}: ${fmt(a)} : ${fmt(intermediate)} = ${ans}.`;
                    break;
                  }
                }
              }
            }
            attempts++;
          }
        }

        display = formulaStr;
        answer = ans;
        explanation = explStr;
      } else if (idx >= 5) {
        // Division: dividend : divisor = answer
        let res = 2;
        let divisor = 3;
        let dividend = 6;
        let attempts = 0;
        while (attempts < 500) {
          const testRes = getAdjustedInt(-10, 10);
          const testDiv = getAdjustedInt(-10, 10);
          if (testDiv !== 0 && testRes !== 0) {
            const testDividend = testRes * testDiv;
            if (Math.abs(testDividend) <= 99 && Math.abs(testDiv) <= 99 && Math.abs(testRes) <= 99) {
              res = testRes;
              divisor = testDiv;
              dividend = testDividend;
              break;
            }
          }
          attempts++;
        }

        display = `${fmt(dividend)} : ${fmt(divisor)}`;
        answer = res;
        explanation = "Al dividir, aplicamos la regla de signos: signos iguales dan positivo (+), signos distintos dan negativo (-).";
      } else {
        // Multiplication: a · b = answer
        let a = 2;
        let b = 3;
        let attempts = 0;
        while (attempts < 500) {
          const testA = getAdjustedInt(-10, 10);
          const testB = getAdjustedInt(-10, 10);
          if (testA !== 0 && testB !== 0) {
            if (Math.abs(testA * testB) <= 99) {
              a = testA;
              b = testB;
              break;
            }
          }
          attempts++;
        }

        display = `${fmt(a)} · ${fmt(b)}`;
        answer = a * b;
        explanation = "Multiplica los valores absolutos. Luego, aplica la regla de signos: (+)·(+)=(+), (-)·(-)=(+), (+)·(-)=(-), (-)·(+)=(-).";
      }
    } else if (lvl === 3) {
      // Asteroids: Random mixed basic operations
      let a = getAdjustedInt(-10, 10);
      let b = getAdjustedInt(-10, 10);
      let op = idx % 3;

      if (op === 0) {
        display = `${fmt(a)} + ${fmt(b)}`;
        answer = a + b;
        explanation = "Operador de suma. Agrupa y calcula respetando los signos de cada número.";
      } else if (op === 1) {
        display = `${fmt(a)} - ${fmt(b)}`;
        answer = a - b;
        explanation = `Operador de resta. Convierte la resta en suma sumando el opuesto: ${fmt(a)} + ${fmt(-b)}.`;
      } else {
        if (a === 0) a = 1;
        if (b === 0) b = 1;
        display = `${fmt(a)} · ${fmt(b)}`;
        answer = a * b;
        explanation = "Operador de multiplicación. Multiplica y aplica la regla de signos.";
      }
    } else if (lvl === 4) {
      // The Guardian: Jerarquía con operaciones combinadas
      let attempts = 0;
      let displayStr = "";
      let ans = 0;
      let explStr = "";

      while (attempts < 1000) {
        const option = idx % 4;
        if (option === 0) {
          // Pattern 1: a + b · c
          const a = getAdjustedInt(-20, 20);
          const b = getAdjustedInt(-8, 8);
          const c = getAdjustedInt(-8, 8);
          if (b !== 0 && c !== 0) {
            const prod = b * c;
            const finalAns = a + prod;
            if (Math.abs(finalAns) <= 99 && Math.abs(prod) <= 99) {
              ans = finalAns;
              displayStr = `${fmt(a)} + ${fmt(b)} · ${fmt(c)}`;
              explStr = `Primero resolvemos la multiplicación: ${fmt(b)} · ${fmt(c)} = ${fmt(prod)}. Luego sumamos con ${fmt(a)}: ${fmt(a)} + (${fmt(prod)}) = ${ans}.`;
              break;
            }
          }
        } else if (option === 1) {
          // Pattern 2: a + b · c + d · e
          const a = getAdjustedInt(-15, 15);
          const b = getAdjustedInt(-6, 6);
          const c = getAdjustedInt(-6, 6);
          const d = getAdjustedInt(-6, 6);
          const e = getAdjustedInt(-6, 6);
          if (b !== 0 && c !== 0 && d !== 0 && e !== 0) {
            const prod1 = b * c;
            const prod2 = d * e;
            const finalAns = a + prod1 + prod2;
            if (Math.abs(prod1) <= 99 && Math.abs(prod2) <= 99 && Math.abs(finalAns) <= 99) {
              ans = finalAns;
              displayStr = `${fmt(a)} + ${fmt(b)} · ${fmt(c)} + ${fmt(d)} · ${fmt(e)}`;
              explStr = `Primero resolvemos las multiplicaciones de izquierda a derecha: ${fmt(b)} · ${fmt(c)} = ${fmt(prod1)} y ${fmt(d)} · ${fmt(e)} = ${fmt(prod2)}. Luego operamos el resto: ${fmt(a)} + (${fmt(prod1)}) + (${fmt(prod2)}) = ${ans}.`;
              break;
            }
          }
        } else if (option === 2) {
          // Pattern 3: a - [b · c + d]
          const a = getAdjustedInt(-20, 20);
          const b = getAdjustedInt(-6, 6);
          const c = getAdjustedInt(-6, 6);
          const d = getAdjustedInt(-15, 15);
          const op = Math.random() > 0.5 ? "+" : "-";
          if (b !== 0 && c !== 0) {
            const prod = b * c;
            const inside = op === "+" ? prod + d : prod - d;
            const finalAns = a - inside;
            if (Math.abs(prod) <= 99 && Math.abs(inside) <= 99 && Math.abs(finalAns) <= 99) {
              ans = finalAns;
              displayStr = `${fmt(a)} - [ ${fmt(b)} · ${fmt(c)} ${op} ${fmt(d)} ]`;
              explStr = `Resolvemos el corchete. Primero la multiplicación dentro del corchete: ${fmt(b)} · ${fmt(c)} = ${fmt(prod)}. Luego operamos el resultado con ${fmt(d)}: ${fmt(prod)} ${op} (${fmt(d)}) = ${fmt(inside)}. Finalmente restamos de ${fmt(a)}: ${fmt(a)} - (${fmt(inside)}) = ${ans}.`;
              break;
            }
          }
        } else {
          // Pattern 4: a - [b + c · d]
          const a = getAdjustedInt(-20, 20);
          const b = getAdjustedInt(-15, 15);
          const c = getAdjustedInt(-6, 6);
          const d = getAdjustedInt(-6, 6);
          const op = Math.random() > 0.5 ? "+" : "-";
          if (c !== 0 && d !== 0) {
            const prod = c * d;
            const inside = op === "+" ? b + prod : b - prod;
            const finalAns = a - inside;
            if (Math.abs(prod) <= 99 && Math.abs(inside) <= 99 && Math.abs(finalAns) <= 99) {
              ans = finalAns;
              displayStr = `${fmt(a)} - [ ${fmt(b)} ${op} ${fmt(c)} · ${fmt(d)} ]`;
              explStr = `Resolvemos el corchete. Primero la multiplicación dentro del corchete: ${fmt(c)} · ${fmt(d)} = ${fmt(prod)}. Luego sumamos/restamos con ${fmt(b)}: ${fmt(b)} ${op} (${fmt(prod)}) = ${fmt(inside)}. Finalmente restamos de ${fmt(a)}: ${fmt(a)} - (${fmt(inside)}) = ${ans}.`;
              break;
            }
          }
        }
        attempts++;
      }

      display = displayStr || "0";
      answer = ans;
      explanation = explStr || "Error al generar";
    } else if (lvl === 5) {
      // Exponential Level
      if (idx === 1) {
        // Exactly one with exponent 0, negative base
        const baseVal = rInt(-5, -2);
        display = `(${baseVal})<sup>0</sup>`;
        answer = 1;
        explanation = `Cualquier número entero (excepto 0) elevado a exponente 0 es igual a 1. Con paréntesis: (${baseVal})⁰ = 1.`;
      } else if (idx === 2) {
        // Exactly one with exponent 1, negative base
        const baseVal = rInt(-5, -2);
        display = `(${baseVal})<sup>1</sup>`;
        answer = baseVal;
        explanation = `Cualquier número elevado a exponente 1 es igual al propio número. Por tanto: (${baseVal})¹ = ${baseVal}.`;
      } else if (idx === 4 || idx === 7) {
        // Negative base WITHOUT parenthesis
        const baseVal = rInt(2, 4); // positive base inside power
        const expVal = rInt(2, 4);
        display = `-${baseVal}<sup>${expVal}</sup>`;
        answer = -Math.pow(baseVal, expVal);
        explanation = `¡Atención! Sin paréntesis, el signo negativo no está afectado por el exponente. La potencia se calcula primero: ${baseVal}<sup>${expVal}</sup> = ${Math.pow(baseVal, expVal)}. Luego se aplica el signo menos: -${Math.pow(baseVal, expVal)}.`;
      } else {
        // Majority of negative bases, with parenthesis
        const baseVal = rInt(-5, -2);
        const expVal = rInt(2, 4);
        display = `(${baseVal})<sup>${expVal}</sup>`;
        answer = Math.pow(baseVal, expVal);
        const isPar = expVal % 2 === 0;
        explanation = `Base negativa con paréntesis. Al elevar un número negativo a un exponente ${isPar ? 'PAR' : 'IMPAR'}, el resultado es ${isPar ? 'POSITIVO' : 'NEGATIVO'}: (${baseVal})<sup>${expVal}</sup> = ${answer}.`;
      }
    } else if (lvl === 6) {
      // Nucleus: MASTER EQUATION - 5 distinct types of exercises based on idx
      const option = idx % 5;
      let attempts = 0;
      let displayStr = "";
      let ans = 0;
      let explStr = "";

      while (attempts < 1000) {
        if (option === 0) {
          // Type 1: [ A + B · C ] + D²
          const A = getAdjustedInt(-10, 10);
          const B = getAdjustedInt(-5, 5);
          const C = getAdjustedInt(-5, 5);
          const D = getAdjustedInt(-4, 4);
          if (B !== 0 && C !== 0 && D !== 0) {
            const prod = B * C;
            const bracket = A + prod;
            const power = Math.pow(D, 2);
            ans = bracket + power;
            if (Math.abs(ans) <= 150) {
              displayStr = `[ ${fmt(A)} + ${fmt(B)} · ${fmt(C)} ] + ${fmt(D)}<sup>2</sup>`;
              explStr = `Primero resolvemos el corchete: ${fmt(B)} · ${fmt(C)} = ${fmt(prod)}, y sumamos ${fmt(A)} dando ${bracket}. Calculamos la potencia: ${fmt(D)}² = ${power}. Finalmente, sumamos ambos resultados: ${bracket} + ${power} = ${ans}.`;
              break;
            }
          }
        } else if (option === 1) {
          // Type 2: A² - [ B + C : D ]
          const A = getAdjustedInt(-4, 4);
          const D = getAdjustedInt(2, 4) * (Math.random() > 0.5 ? 1 : -1);
          const factor = getAdjustedInt(-4, 4);
          const B = getAdjustedInt(-12, 12);
          if (A !== 0 && D !== 0 && factor !== 0) {
            const C = D * factor;
            const power = Math.pow(A, 2);
            const div = C / D;
            const bracket = B + div;
            ans = power - bracket;
            if (Math.abs(ans) <= 150) {
              displayStr = `${fmt(A)}<sup>2</sup> - [ ${fmt(B)} + ${fmt(C)} : ${fmt(D)} ]`;
              explStr = `Resolvemos la potencia exterior: ${fmt(A)}² = ${power}. Luego el corchete de derecha a izquierda, priorizando la división: ${fmt(C)} : ${fmt(D)} = ${fmt(div)}. Sumamos ${fmt(B)}: ${fmt(B)} + (${fmt(div)}) = ${bracket}. Finalmente restamos: ${power} - (${bracket}) = ${ans}.`;
              break;
            }
          }
        } else if (option === 2) {
          // Type 3: [ A · B ] : C - D³
          const C = getAdjustedInt(2, 4) * (Math.random() > 0.5 ? 1 : -1);
          const factor = getAdjustedInt(-4, 4);
          const D = getAdjustedInt(-3, 3);
          if (C !== 0 && factor !== 0) {
            const prod = C * factor;
            // Now we need A and B such that A * B = prod
            let A = getAdjustedInt(-5, 5);
            if (A === 0) A = 1;
            // Ensure exact integer divisor
            if (prod % A === 0) {
              const B = prod / A;
              const div = prod / C;
              const power = Math.pow(D, 3);
              ans = div - power;
              if (Math.abs(ans) <= 150) {
                displayStr = `[ ${fmt(A)} · ${fmt(B)} ] : ${fmt(C)} - ${fmt(D)}<sup>3</sup>`;
                explStr = `Multiplicamos dentro del corchete: ${fmt(A)} · ${fmt(B)} = ${fmt(prod)}. Dividimos el resultado entre ${fmt(C)}: ${fmt(prod)} : ${fmt(C)} = ${fmt(div)}. Calculamos la potencia: ${fmt(D)}³ = ${power}. Restamos ambos términos: ${div} - (${power}) = ${ans}.`;
                break;
              }
            }
          }
        } else if (option === 3) {
          // Type 4: A · [ B² - C ] + D
          const B = getAdjustedInt(-4, 4);
          const C = getAdjustedInt(-10, 10);
          const A = getAdjustedInt(-5, 5);
          const D = getAdjustedInt(-15, 15);
          if (B !== 0 && A !== 0) {
            const power = Math.pow(B, 2);
            const bracket = power - C;
            const prod = A * bracket;
            ans = prod + D;
            if (Math.abs(ans) <= 150) {
              displayStr = `${fmt(A)} · [ ${fmt(B)}<sup>2</sup> - ${fmt(C)} ] + ${fmt(D)}`;
              explStr = `Resolvemos primero la potencia dentro del corchete: ${fmt(B)}² = ${power}. Restamos ${fmt(C)} dentro del corchete: ${power} - (${fmt(C)}) = ${bracket}. Multiplicamos por ${fmt(A)}: ${fmt(A)} · ${bracket} = ${prod}. Sumamos ${fmt(D)}: ${prod} + (${fmt(D)}) = ${ans}.`;
              break;
            }
          }
        } else {
          // Type 5: A + B · C - D : E
          const A = getAdjustedInt(-15, 15);
          const B = getAdjustedInt(-5, 5);
          const C = getAdjustedInt(-5, 5);
          const E = getAdjustedInt(2, 4) * (Math.random() > 0.5 ? 1 : -1);
          const factor = getAdjustedInt(-4, 4);
          if (B !== 0 && C !== 0 && E !== 0 && factor !== 0) {
            const D = E * factor;
            const prod = B * C;
            const div = D / E;
            ans = A + prod - div;
            if (Math.abs(ans) <= 150) {
              displayStr = `${fmt(A)} + ${fmt(B)} · ${fmt(C)} - ${fmt(D)} : ${fmt(E)}`;
              explStr = `Sin paréntesis: resolvemos primero multiplicación y división de izquierda a derecha: ${fmt(B)} · ${fmt(C)} = ${prod} y ${fmt(D)} : ${fmt(E)} = ${div}. Finalmente operamos de izquierda a derecha: ${fmt(A)} + (${prod}) - (${div}) = ${ans}.`;
              break;
            }
          }
        }
        attempts++;
      }

      display = displayStr || "0";
      answer = ans;
      explanation = explStr || "Error de cálculo";
    }

    return { display, answer, explanation };
  },
};
