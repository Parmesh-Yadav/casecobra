'use client'

import HandleComponent from "@/components/HandleComponent";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatPrice } from "@/lib/utils";
import NextImage from "next/image";
import { Rnd } from "react-rnd";
import { RadioGroup } from "@headlessui/react";
import { useRef, useState } from "react";
import { COLORS, FINISHES, MATERIALS, MODELS } from "@/validators/option-validator";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, CheckIcon, ChevronsUpDown } from "lucide-react";
import { DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { BASE_PRICE } from "@/app/config/products";
import { useToast } from "@/hooks/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { useMutation } from "@tanstack/react-query";
import { SaveConfigArgs, saveConfig as _saveConfig } from "./actions";
import { useRouter } from "next/navigation";


interface DesignConfiguratorProps {
    configId: string;
    imageUrl: string;
    imageDimensions: { width: number, height: number }
}

const DesignConfigurator = ({ configId, imageUrl, imageDimensions }: DesignConfiguratorProps) => {

    const { toast } = useToast();

    const router = useRouter();

    const { mutate: saveConfig, isPending } = useMutation({
        mutationKey: ["save-config"],
        mutationFn: async (args: SaveConfigArgs) => {
            await Promise.all([saveConfiguration(), _saveConfig(args)]);
        },
        onError: () => {
            toast({
                title: "Something went wrong",
                description: "There was a problem on our end, please try again.",
                variant: "destructive"
            });
        },
        onSuccess: () => {
            router.push(`/configure/preview?id=${configId}`);
        }
    })

    const { startUpload } = useUploadThing('imageUploader');

    const [options, setOptions] = useState<{
        color: (typeof COLORS)[number]
        model: (typeof MODELS.options)[number]
        materials: (typeof MATERIALS.options)[number]
        finishes: (typeof FINISHES.options)[number]
    }>({
        color: COLORS[0],
        model: MODELS.options[0],
        materials: MATERIALS.options[0],
        finishes: FINISHES.options[0]
    });

    const [renderedDimension, setRenderedDimension] = useState(
        {
            width: imageDimensions.width / 4,
            height: imageDimensions.height / 4
        }
    );

    const [renderedPosition, setRenderedPosition] = useState(
        {
            x: 150,
            y: 205
        }
    );

    const phoneCaseRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    async function saveConfiguration() {
        try {
            const { left: caseLeft, top: caseTop, width, height } = phoneCaseRef.current!.getBoundingClientRect();
            const { left: containerLeft, top: containerTop } = containerRef.current!.getBoundingClientRect();
            const leftOffset = caseLeft - containerLeft;
            const topOffset = caseTop - containerTop;
            const actualX = renderedPosition.x - leftOffset;
            const actualY = renderedPosition.y - topOffset;

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");

            const userImage = new Image();
            userImage.crossOrigin = "anonymous";
            userImage.src = imageUrl;
            await new Promise((resolve) => (userImage.onload = resolve));

            ctx?.drawImage(
                userImage,
                actualX,
                actualY,
                renderedDimension.width,
                renderedDimension.height
            );
            const base64 = canvas.toDataURL("image/png");
            const base64Data = base64.split(",")[1];
            const blob = base64ToBlob(base64Data, "image/png");
            const file = new File([blob], "filename.png", { type: "image/png" });

            await startUpload([file], { configId });
        } catch (e) {
            console.log(e);
            toast({
                title: "Something went wrong",
                description: "There was a problem saving your config, please try again.",
                variant: "destructive"
            })
        }
    }

    function base64ToBlob(base64Data: string, mimeType: string) {
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++)
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    }

    return (
        <div className="relative mt-20 grid grid-cols-1 lg:grid-cols-3 mb-20 pb-20">
            <div ref={containerRef} className="relative h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                <div className="relative w-60 bg-opacity-50 pointer-events-none aspect-[896/1831]">
                    <AspectRatio ref={phoneCaseRef} ratio={896 / 1831} className="pointer-events-none relative z-50 aspect-[896/1831] w-full">
                        <NextImage
                            src="/phone-template.png"
                            alt="Phone template"
                            className="pointer-events-none z-50 select-none"
                            fill
                        />
                    </AspectRatio>
                    <div className="absolute z-40 inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]" />
                    <div className={cn("absolute inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px]", `bg-${options.color.tw}`)} />
                </div>
                <Rnd default={{
                    x: 150,
                    y: 205,
                    height: imageDimensions.height / 4,
                    width: imageDimensions.width / 4
                }}
                    lockAspectRatio
                    resizeHandleComponent={{
                        bottomRight: <HandleComponent />,
                        bottomLeft: <HandleComponent />,
                        topRight: <HandleComponent />,
                        topLeft: <HandleComponent />
                    }}
                    onResizeStop={(_, __, ref, ___, { x, y }) => {
                        setRenderedDimension({
                            height: parseInt(ref.style.height.slice(0, -2)),
                            width: parseInt(ref.style.width.slice(0, -2))
                        });
                        setRenderedPosition({
                            x,
                            y
                        });
                    }}
                    onDragStop={(_, data) => {
                        const { x, y } = data;
                        setRenderedPosition({
                            x,
                            y
                        })
                    }}
                    className="absolute z-20 border-[3px] border-primary"
                >
                    <div className="relative w-full h-full">
                        <NextImage
                            src={imageUrl}
                            alt="Design preview"
                            fill
                            className="pointer-events-none"
                        />
                    </div>
                </Rnd>
            </div>
            <div className="h-[37.5rem] w-full col-span-full lg:col-span-1 flex flex-col bg-white">
                <ScrollArea className="relative flex-1 overflow-auto text-zinc-900">
                    <div aria-hidden={true} className="absolute inset-x-0 z-10 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none" />
                    <div className="px-8 pb-12 pt-8">
                        <h2 className="tracking-tight font-bold text-3xl ">
                            Customize your case
                        </h2>
                        <div className="w-full h-px bg-zinc-200 my-6" />
                        <div className="relative flex flex-col justify-between mt-4 h-full">
                            <div className="flex flex-col gap-6">
                                <RadioGroup
                                    value={options.color}
                                    onChange={(val) => {
                                        setOptions((prev) => ({
                                            ...prev,
                                            color: val
                                        }))
                                    }}
                                >
                                    <Label>
                                        Color:{options.color.label}
                                    </Label>
                                    <div className="mt-3 flex items-center space-x-3">
                                        {
                                            COLORS.map((color) => (
                                                <RadioGroup.Option key={color.label} value={color} className={({ active, checked }) =>
                                                    cn("relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent", {
                                                        [`border-${color.tw}`]: active || checked
                                                    })
                                                }>
                                                    <span className={cn(`bg-${color.tw}`, "h-8 w-8 rounded-full border border-black border-opacity-10")} />
                                                </RadioGroup.Option>
                                            ))
                                        }
                                    </div>
                                </RadioGroup>
                                <div className="relative flex flex-col gap-3 w-full">
                                    <Label>Model</Label>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" role="combobox" className="w-full justify-between">
                                                {options.model.label}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-full z-10 bg-white p-4">
                                            {
                                                MODELS.options.map((model) => (
                                                    <DropdownMenuItem key={model.label} className={cn("flex text-sm gap-3 items-center p-1.5 cursor-default hover:bg-zinc-100", {
                                                        "bg-zinc-100": model.label === options.model.label,
                                                    })}
                                                        onClick={() => {
                                                            setOptions((prev) => ({
                                                                ...prev,
                                                                model
                                                            }))
                                                        }}
                                                    >
                                                        <CheckIcon className={cn("mr-2 w-4 h-4", model.label === options.model.label ? "opacity-100" : "opacity-0")} />
                                                        {model.label}
                                                    </DropdownMenuItem>
                                                ))
                                            }
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                {
                                    [MATERIALS, FINISHES].map(({ name, options: selectableOptions }) => (
                                        <RadioGroup key={name} value={options[name]} onChange={(val) => {
                                            setOptions((prev) => ({
                                                ...prev,
                                                [name]: val
                                            }))
                                        }}>
                                            <Label>
                                                {
                                                    name.slice(0, 1).toUpperCase() + name.slice(1)
                                                }
                                            </Label>
                                            <div className="mt-3 space-y-4">
                                                {
                                                    selectableOptions.map((option) => (
                                                        <RadioGroup.Option key={option.value} value={option} className={({ active, checked }) => cn("relative block cursor-pointer rounded-lg bg-white px-6 py-4 shadow-sm border-2 border-zinc-200 focus:outline-none ring-0 focus:ring-0 outline-none sm:flex sm:justify-between", {
                                                            "border-primary": active || checked
                                                        })}>
                                                            <span className="flex items-center">
                                                                <span className="flex flex-col text-sm">
                                                                    <RadioGroup.Label as="span" className="font-medium text-gray-900">
                                                                        {
                                                                            option.label
                                                                        }
                                                                    </RadioGroup.Label>
                                                                    {
                                                                        option.description ? (
                                                                            <RadioGroup.Description as="span" className="text-gray-500">
                                                                                <span className="block sm:inline">
                                                                                    {option.description}
                                                                                </span>
                                                                            </RadioGroup.Description>
                                                                        ) : null
                                                                    }
                                                                </span>
                                                            </span>
                                                            <RadioGroup.Description as="span" className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right">
                                                                <span className="font-medium text-gray-900">
                                                                    {
                                                                        formatPrice(option.price / 100)
                                                                    }
                                                                </span>
                                                            </RadioGroup.Description>
                                                        </RadioGroup.Option>
                                                    ))
                                                }
                                            </div>
                                        </RadioGroup>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </ScrollArea>
                <div className="w-full px-8 h-16 bg-white text-zinc-900">
                    <div className="h-px w-full bg-zinc-200" />
                    <div className="w-full h-full flex justify-end items-center">
                        <div className="w-full flex gap-6 items-center">
                            <p className="font-medium whitespace-nowrap">
                                {
                                    formatPrice((BASE_PRICE + options.finishes.price + options.materials.price) / 100)
                                }
                            </p>
                            <Button size="sm" className="w-full" onClick={() => {
                                saveConfig({
                                    color: options.color.value,
                                    finish: options.finishes.value,
                                    material: options.materials.value,
                                    model: options.model.value,
                                    configId
                                })
                            }}
                            isLoading={isPending}
                            disabled={isPending}
                            loadingText="Saving..."
                            >
                                Continue
                                <ArrowRightIcon className="h-4 w-4 ml-1.5 inline" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DesignConfigurator
