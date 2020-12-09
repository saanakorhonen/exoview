const tempcolor = [
	[1000, 255, 8.5935, 0.0],
	[3000, 255, 117.0195, 37.8165],
	[5600, 255, 217.209, 195.993],
	[6700, 253.3935, 242.913, 255],
	[8700, 182.886, 196.3245, 255],
	[20000, 106.998, 136.1445, 255],
	[40000, 90.8565, 120.9975, 255],
];

function FindIndex(temp) {
	for (let i = 1; i < tempcolor.length; i++) {
		if (temp < tempcolor[i][0]) {
			return i - 1;
		}
	}
	return 0;
}

function GradientColor(temperature, i, j) {
	let a = tempcolor[i][0];
	let b = tempcolor[i + 1][0];
	let diff = b - a;
	let tempdiff = temperature - a;
	let modifier = tempdiff / diff;

	a = tempcolor[i][j];
	b = tempcolor[i + 1][j];
	return a + (b - a) * modifier;
}

export default function Starcolor(temperature) {
	if (temperature == undefined) return 'white';
	if (temperature < 1000) return 'rgb(255, 8.5935, 0)';
	if (temperature > 39999) return 'rgb(90.8565, 120.9975, 255)';

	let index = FindIndex(temperature);
	let r = GradientColor(temperature, index, 1);
	let g = GradientColor(temperature, index, 2);
	let b = GradientColor(temperature, index, 3);
	//console.log('rgb(' + r + ',' + g + ',' + b + ')');
	return 'rgb(' + r + ',' + g + ',' + b + ')';
}
