#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

mat2 rotate2D(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat2(c, s, -s, c);
}

void main() {
    vec2 fragCoord = gl_FragCoord.xy;

    vec2 uv = (fragCoord - 0.5 * u_resolution.xy) / u_resolution.y;

    vec3 color = vec3(0.0);

    float time = u_time;
    float rayDepth = 0.05;

    for (int i = 0; i < 100; i++) {

        vec3 p = vec3(uv * rayDepth, rayDepth - 1.0);

        p.xz *= rotate2D(time * 0.2);
        p.yz *= rotate2D(time * 0.1);

        float r = length(p);

        vec3 logP = vec3(
                log(r) - time * 0.5,
                asin(-p.z / r),
                atan(p.x, p.y) + time
        );

        float d = logP.y - 1.2;
        float scale = 0.6;

        for (int j = 0; j < 6; j++) {
            d += abs(
                    dot(
                            sin(logP * scale),
                            cos(logP.zxy * scale)
                    )
            ) / scale;

            scale *= 2.0;
        }

        float glow = exp(-abs(d) * 25.2) + 0.35;

        vec3 glowColor = vec3(1.0, 0.1, 0.5) *
        (0.6 + 0.4 * sin(logP.y * 2.0 + time));

        color += glow * glowColor * 0.015;

        rayDepth += max(abs(d) * r * 0.05, 0.002);
    }

    color = pow(color, vec3(0.8));

    gl_FragColor = vec4(color, 1.0);
}