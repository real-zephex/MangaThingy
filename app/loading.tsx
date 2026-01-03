import { Spinner } from "@/components/ui/spinner";

const Loading = () => {
    return (
        <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center">
            <Spinner className="size-8 text-primary" />
            <p>
                Loading...
            </p>
        </div>
    );
};

export default Loading;
