import { PropsWithChildren } from 'react';
import styled from '@emotion/styled';
import * as Dialog from '@radix-ui/react-dialog';

// 스타일이 적용된 컴포넌트
const StyledOverlay = styled(Dialog.Overlay)`
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    inset: 0;
`;

const TriggerButton = styled(Dialog.Trigger)`
    border: 1px solid red;
    all: unset;
    background: aliceblue;
    color: black;
    padding: 15px;
    width: 100%;
    max-width: fit-content;
`;

const StyledContent = styled(Dialog.Content)`
    background-color: white;
    border-radius: 4px;
    padding: 20px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const StyledTitle = styled(Dialog.Title)`
    font-size: 1.5rem;
    margin-bottom: 10px;
`;

const StyledDescription = styled(Dialog.Description)`
    margin-bottom: 20px;
`;

const StyledCloseButton = styled(Dialog.Close)`
    position: absolute;
    top: 10px;
    right: 10px;
`;

// 묶은 Modal 컴포넌트
export const Modal = {
    Root: Dialog.Root,
    Trigger: TriggerButton,
    Content: ({ children, ...props }: PropsWithChildren) => (
        <Dialog.Portal>
            <StyledOverlay />
            <StyledContent {...props}>{children}</StyledContent>
        </Dialog.Portal>
    ),
    Title: StyledTitle,
    Description: StyledDescription,
    Close: StyledCloseButton,
};
