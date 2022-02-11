import React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import LabelComponent from '../label';
import Client, { Label, ErrorInfo, MapInfo } from '../../../../classes/client';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { activeInstance } from '../../../../redux/clientSlice';
import AddLabelForm from '../add-label-form';
import { LabelListContainer } from './styled';

export type LabelSelectorProps = {
    maps: MapInfo[];
    onChange: (label: Label, checked: boolean) => void;
};

export function LabelSelector({ onChange, maps }: LabelSelectorProps): React.ReactElement {
    const client: Client = useSelector(activeInstance);
    const { data: labels = [] } = useQuery<unknown, ErrorInfo, Label[]>('labels', async () =>
        client.fetchLabels()
    );

    const checkedLabelIds = labels
        .map((l) => l.id)
        .filter((labelId) => maps.every((m) => m.labels.find((l) => l.id === labelId)));

    return (
        <Container>
            <FormGroup>
                <AddLabelForm onAdd={(label) => onChange(label, true)} />
            </FormGroup>
            <LabelListContainer>
                {labels.map(({ id, title, color }) => (
                    <FormControlLabel
                        key={id}
                        control={
                            <Checkbox
                                id={`${id}`}
                                checked={checkedLabelIds.includes(id)}
                                onChange={(e) => {
                                    onChange({ id, title, color }, e.target.checked);
                                }}
                                name={title}
                                color="primary"
                            />
                        }
                        label={<LabelComponent label={{ id, title, color }} size="big" />}
                    />
                ))}
            </LabelListContainer>
        </Container>
    );
}
