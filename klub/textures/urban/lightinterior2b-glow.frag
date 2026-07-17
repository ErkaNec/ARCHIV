#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;


#define TAU 6.28318530718
#define MAX_ITER 5


void main()
{
    vec2 fragCoord = gl_FragCoord.xy;


    float time = u_time * 0.5 + 23.0;


    vec2 uv = fragCoord / u_resolution.xy;


    vec2 p = mod(
            uv * TAU,
            TAU
    ) - 250.0;


    vec2 i = p;

    float c = 1.0;
    float inten = 0.005;



    for (int n = 0; n < MAX_ITER; n++)
    {
        float t = time *
        (1.0 - (3.5 / float(n + 1)));


        i = p + vec2(
                cos(t - i.x) + sin(t + i.y),
                sin(t - i.y) + cos(t + i.x)
        );


        c += 1.0 / length(
                vec2(
                        p.x / (sin(i.x + t) / inten),
                        p.y / (cos(i.y + t) / inten)
                )
        );
    }



    c /= float(MAX_ITER);

    c = 1.17 - pow(c, 1.4);



    // BÍLÁ NEONOVÁ TEXTURA
    float glow = pow(abs(c), 8.0);

    vec3 colour = vec3(glow);


    // základní bílá záře
    colour *= 1.4;

    colour += vec3(0.15);



    // PARTY BLIKÁNÍ

    float pulse = sin(u_time * 19.0);


    pulse = smoothstep(
            0.2,
            1.0,
            pulse
    );


    // krátké intenzivní záblesky
    float flash = pow(
            max(pulse, 0.0),
            3.0
    );


    colour *= 0.6 + flash * 2.5;



    // lehké zesílení při záblesku
    colour += vec3(
            flash * 0.35
    );



    colour = clamp(
            colour,
            0.0,
            1.0
    );



    gl_FragColor = vec4(
            colour,
            1.0
    );
}