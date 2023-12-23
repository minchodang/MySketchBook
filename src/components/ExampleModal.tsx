import { FC, PropsWithChildren } from 'react';
import styled from '@emotion/styled';
import { Modal } from './Modal';

export const ExampleModal: FC<PropsWithChildren> = ({ children, ...props }) => (
    <Modal.Root>
        <Modal.Trigger>모달생성</Modal.Trigger>
        <Modal.Content {...props}>
            <Modal.Title>Example Details</Modal.Title>
            <Modal.Description>This is a Example description.</Modal.Description>
            {children}
            <Modal.Close>Close</Modal.Close>
        </Modal.Content>
    </Modal.Root>
);
