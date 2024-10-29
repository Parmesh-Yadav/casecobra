// bg-blue-950 border-blue-950
// bg-rose-950 border-rose-950
// bg-zinc-900 border-zinc-900
// bg-green-950 border-green-950
// bg-purple-950 border-purple-950
// bg-orange-950 border-orange-950

import { PRODUCT_PRICES } from "@/app/config/products";

export const COLORS = [
    {
        label: "Black",
        value: "black",
        tw: "zinc-900"
    },
    {
        label: "Blue",
        value: "blue",
        tw: "blue-950"
    },
    {
        label: "Rose",
        value: "rose",
        tw: "rose-950"
    },
    {
        label: "Green",
        value: "green",
        tw: "green-950"
    },
    {
        label: "Purple",
        value: "purple",
        tw: "purple-950"
    },
    {
        label: "Orange",
        value: "orange",
        tw: "orange-950"
    },
] as const;

export const MODELS = {
    name: "models",
    options: [
        {
            label: "iPhone 12",
            value: "iphone12"
        },
        {
            label: "iPhone 12 Pro",
            value: "iphone12pro"
        },
        {
            label: "iPhone 13",
            value: "iphone13"
        },
        {
            label: "iPhone 13 Pro",
            value: "iphone13pro"
        },
        {
            label: "iPhone 14",
            value: "iphone14"
        },
        {
            label: "iPhone 14 Pro",
            value: "iphone14pro"
        },
        {
            label: "iPhone 15",
            value: "iphone15"
        },
        {
            label: "iPhone 15 Pro",
            value: "iphone15pro"
        },
        {
            label: "iPhone 16",
            value: "iphone16"
        },
        {
            label: "iPhone 16 Pro",
            value: "iphone16pro"
        },
    ]
} as const;

export const MATERIALS = {
    name: "materials",
    options: [
        {
            label: "Silicon",
            value: "silicon",
            description: undefined,
            price: PRODUCT_PRICES.material.silicon
        },
        {
            label: "Soft Polycarbonate",
            value: "polycarbonate",
            description: "Scratch Resistant Coating",
            price: PRODUCT_PRICES.material.polycarbonate
        }
    ]
} as const

export const FINISHES = {
    name: "finishes",
    options: [
        {
            label: "Smooth Finish",
            value: "smooth",
            description: undefined,
            price: PRODUCT_PRICES.finish.smooth
        },
        {
            label: "Textured Finish",
            value: "textured",
            description: "Grip Texture",
            price: PRODUCT_PRICES.finish.textured
        }
    ]
} as const